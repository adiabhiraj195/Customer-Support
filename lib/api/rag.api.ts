import { apiFetch } from "./client";
import {
  IngestRequest,
  IngestResponse,
  JobStatusResponse,
  StatelessChatRequest,
  StatelessChatResponse,
  UploadUrlRequest,
  UploadUrlResponse,
} from "@/types/api";

export async function getUploadUrl(
  body: UploadUrlRequest
): Promise<UploadUrlResponse> {
  return apiFetch<UploadUrlResponse>("/rag/upload-url", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function uploadFileToS3(
  uploadUrl: string,
  file: File | Blob,
  contentType: string = "text/plain"
): Promise<void> {
  if (!uploadUrl) {
    throw new Error("Cannot upload to S3: Presigned upload URL is missing or undefined.");
  }

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `S3 direct upload failed with status ${response.status} (${response.statusText})${
        errorText ? `: ${errorText.slice(0, 200)}` : ""
      }`
    );
  }
}

export async function queueIngestion(
  body: IngestRequest
): Promise<IngestResponse> {
  return apiFetch<IngestResponse>("/rag/injestTXT", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return apiFetch<JobStatusResponse>(`/rag/job-status/${jobId}`, {
    method: "GET",
  });
}

export async function statelessChat(
  body: StatelessChatRequest
): Promise<StatelessChatResponse> {
  return apiFetch<StatelessChatResponse>("/rag/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

