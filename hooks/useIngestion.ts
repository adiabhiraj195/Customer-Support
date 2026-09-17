"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getJobStatus,
  getUploadUrl,
  queueIngestion,
  uploadFileToS3,
} from "@/lib/api/rag.api";
import { useAuthStore } from "@/stores/authStore";
import { IngestResponse, JobStatusResponse } from "@/types/api";

export type UploadStage =
  | "idle"
  | "requesting_url"
  | "uploading_s3"
  | "queuing_ingestion"
  | "completed"
  | "error";

export interface UploadAndIngestParams {
  file: File;
  chunkSize?: number;
  chunkOverlap?: number;
  metadata?: Record<string, unknown>;
  version?: number;
}

export function useIngestion() {
  const { user } = useAuthStore();
  const [stage, setStage] = useState<UploadStage>("idle");

  const uploadAndQueueMutation = useMutation({
    mutationFn: async ({
      file,
      chunkSize,
      chunkOverlap,
      metadata,
      version = 1,
    }: UploadAndIngestParams): Promise<IngestResponse["data"]> => {
      try {
        // Step 1: Request S3 presigned URL (POST /rag/upload-url)
        setStage("requesting_url");
        const mimeType = file.type || "text/plain";
        const uploadUrlRes = await getUploadUrl({
          filename: file.name,
          mimeType,
          userId: user?.id,
          expiresIn: 3600,
        });

        const uploadData = uploadUrlRes.data;
        const presignedUrl = uploadData?.presignedUrl || uploadData?.uploadUrl;
        const s3Key = uploadData?.s3Key || uploadData?.key;

        if (!presignedUrl) {
          throw new Error("Failed to receive presigned upload URL from backend.");
        }
        if (!s3Key) {
          throw new Error("Backend response did not include an S3 storage key.");
        }

        // Step 2: Direct S3 Upload via PUT
        setStage("uploading_s3");
        await uploadFileToS3(presignedUrl, file, mimeType);

        // Step 3: Trigger document ingestion in BullMQ (POST /rag/injestTXT)
        setStage("queuing_ingestion");
        const ingestRes = await queueIngestion({
          s3Key,
          filename: file.name,
          mimeType,
          userId: user?.id,
          version,
          chunkSize,
          chunkOverlap,
          metadata,
        });

        setStage("completed");
        return ingestRes.data;
      } catch (err) {
        setStage("error");
        throw err;
      }
    },
  });

  const resetUpload = () => {
    setStage("idle");
    uploadAndQueueMutation.reset();
  };

  return {
    uploadAndQueue: uploadAndQueueMutation.mutateAsync,
    isUploading: uploadAndQueueMutation.isPending,
    uploadError: uploadAndQueueMutation.error,
    resetUpload,
    stage,
  };
}

export function useJobStatus(jobId: string | null) {
  const query = useQuery<JobStatusResponse["data"]>({
    queryKey: ["jobStatus", jobId],
    queryFn: async () => {
      if (!jobId) throw new Error("No job ID provided");
      const res = await getJobStatus(jobId);
      return res.data;
    },
    enabled: !!jobId,
    refetchInterval: (queryState) => {
      const state = queryState.state.data?.state;
      if (state === "completed" || state === "failed") {
        return false;
      }
      return 1500; // Poll every 1.5 seconds while pending or active
    },
  });

  return {
    job: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isCompleted: query.data?.state === "completed",
    isFailed: query.data?.state === "failed",
  };
}

