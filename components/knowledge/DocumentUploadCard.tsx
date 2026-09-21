"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileUp,
  Loader2,
  Plus,
  Trash,
  UploadCloud,
} from "lucide-react";
import { useIngestion, UploadStage } from "@/hooks/useIngestion";
import { useAuth } from "@/hooks/useAuth";
import { JobStatusTracker } from "./JobStatusTracker";

export function DocumentUploadCard() {
  const { isAuthenticated } = useAuth();
  const { uploadAndQueue, isUploading, uploadError, stage } = useIngestion();

  const [file, setFile] = useState<File | null>(null);
  const [chunkSize, setChunkSize] = useState(800);
  const [chunkOverlap, setChunkOverlap] = useState(150);
  const [version, setVersion] = useState(1);
  const [metadataEntries, setMetadataEntries] = useState<
    Array<{ key: string; value: string }>
  >([
    { key: "category", value: "documentation" },
  ]);

  const [submittedJobIds, setSubmittedJobIds] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddMetadata = () => {
    setMetadataEntries([...metadataEntries, { key: "", value: "" }]);
  };

  const handleRemoveMetadata = (index: number) => {
    setMetadataEntries(metadataEntries.filter((_, i) => i !== index));
  };

  const handleMetadataChange = (
    index: number,
    field: "key" | "value",
    val: string
  ) => {
    const updated = [...metadataEntries];
    updated[index][field] = val;
    setMetadataEntries(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!isAuthenticated) {
      setLocalError("You must be logged in to upload documents.");
      return;
    }

    if (!file) {
      setLocalError("Please select a file to ingest.");
      return;
    }

    const metadata: Record<string, string> = {};
    metadataEntries.forEach((entry) => {
      if (entry.key.trim()) {
        metadata[entry.key.trim()] = entry.value.trim();
      }
    });

    try {
      const data = await uploadAndQueue({
        file,
        chunkSize: Number(chunkSize),
        chunkOverlap: Number(chunkOverlap),
        version: Number(version),
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      });

      if (data.jobId) {
        setSubmittedJobIds((prev) => [data.jobId, ...prev]);
        setSuccessMessage(
          `Document enqueued successfully! BullMQ Job ID: ${data.jobId}`
        );
        setFile(null);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to initiate document ingestion";
      setLocalError(message);
    }
  };

  const getStageLabel = (currentStage: UploadStage) => {
    switch (currentStage) {
      case "requesting_url":
        return "1/3: Requesting S3 Presigned URL (/rag/upload-url)...";
      case "uploading_s3":
        return "2/3: Uploading document to AWS S3 (PUT)...";
      case "queuing_ingestion":
        return "3/3: Queuing Ingestion Job in BullMQ (/rag/injestTXT)...";
      case "completed":
        return "Upload complete & ingestion queued!";
      default:
        return "Upload & Queue Ingestion";
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Upload Form Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">
            Ingest Knowledge Base Document
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Files are uploaded to private S3 via presigned URL and queued in BullMQ for chunking, vector embedding, and indexing into Redis.
          </p>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-success-subtle p-3 text-xs text-success-subtle-foreground border border-success-border">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {(localError || uploadError) && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive-subtle p-3 text-xs text-destructive-subtle-foreground border border-destructive-border">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{localError || (uploadError as Error)?.message}</span>
          </div>
        )}

        {/* 3-Step Ingestion Pipeline Indicator */}
        <div className="rounded-xl bg-muted/40 border border-border p-3">
          <div className="text-[11px] font-medium text-muted-foreground mb-2">
            3-Step Ingestion Pipeline:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div
              className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                stage === "requesting_url"
                  ? "bg-primary-subtle border-primary-border text-primary-subtle-foreground font-medium"
                  : stage === "uploading_s3" || stage === "queuing_ingestion" || stage === "completed"
                  ? "bg-success-subtle border-success-border text-success-subtle-foreground"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {stage === "requesting_url" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
              ) : stage === "uploading_s3" || stage === "queuing_ingestion" || stage === "completed" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
              ) : (
                <span className="h-3.5 w-3.5 flex items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground shrink-0">
                  1
                </span>
              )}
              <div className="truncate">
                <div className="font-semibold text-[11px]">1. Presigned URL</div>
                <div className="text-[10px] text-subtle-foreground font-mono">POST /rag/upload-url</div>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                stage === "uploading_s3"
                  ? "bg-primary-subtle border-primary-border text-primary-subtle-foreground font-medium"
                  : stage === "queuing_ingestion" || stage === "completed"
                  ? "bg-success-subtle border-success-border text-success-subtle-foreground"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {stage === "uploading_s3" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
              ) : stage === "queuing_ingestion" || stage === "completed" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
              ) : (
                <span className="h-3.5 w-3.5 flex items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground shrink-0">
                  2
                </span>
              )}
              <div className="truncate">
                <div className="font-semibold text-[11px]">2. Direct S3 Upload</div>
                <div className="text-[10px] text-subtle-foreground font-mono">PUT [presignedUrl]</div>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                stage === "queuing_ingestion"
                  ? "bg-primary-subtle border-primary-border text-primary-subtle-foreground font-medium"
                  : stage === "completed"
                  ? "bg-success-subtle border-success-border text-success-subtle-foreground"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {stage === "queuing_ingestion" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
              ) : stage === "completed" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
              ) : (
                <span className="h-3.5 w-3.5 flex items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground shrink-0">
                  3
                </span>
              )}
              <div className="truncate">
                <div className="font-semibold text-[11px]">3. Queue Ingestion</div>
                <div className="text-[10px] text-subtle-foreground font-mono">POST /rag/injestTXT</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File input dropzone */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-6 hover:border-primary transition-colors bg-muted/30 text-center">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
            <label className="cursor-pointer">
              <span className="text-xs font-semibold text-primary hover:text-primary-hover">
                Choose a file
              </span>{" "}
              <span className="text-xs text-muted-foreground">
                or drag and drop (.txt, .md, .csv)
              </span>
              <input
                type="file"
                className="hidden"
                accept=".txt,.md,.json,.csv,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </label>
            {file && (
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-foreground bg-card px-3 py-1.5 rounded-lg border border-border shadow-xs">
                <FileUp className="h-4 w-4 text-primary" />
                <span>{file.name}</span>
                <span className="text-subtle-foreground font-normal">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>

          {/* Chunking Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Chunk Size (chars)
              </label>
              <input
                type="number"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:bg-background focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Chunk Overlap (chars)
              </label>
              <input
                type="number"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:bg-background focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Document Version
              </label>
              <input
                type="number"
                value={version}
                min={1}
                onChange={(e) => setVersion(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:bg-background focus:outline-none"
              />
            </div>
          </div>

          {/* Custom Metadata Tags */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-foreground">
                Custom Metadata (Key-Value)
              </label>
              <button
                type="button"
                onClick={handleAddMetadata}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary-hover"
              >
                <Plus className="h-3 w-3" />
                Add Tag
              </button>
            </div>

            <div className="space-y-2">
              {metadataEntries.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g. department)"
                    value={entry.key}
                    onChange={(e) =>
                      handleMetadataChange(idx, "key", e.target.value)
                    }
                    className="flex-1 rounded-xl border border-input bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:border-primary focus:bg-background focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Finance)"
                    value={entry.value}
                    onChange={(e) =>
                      handleMetadataChange(idx, "value", e.target.value)
                    }
                    className="flex-1 rounded-xl border border-input bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:border-primary focus:bg-background focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMetadata(idx)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || isUploading || !isAuthenticated}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-2.5 text-xs shadow-xs transition disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{getStageLabel(stage)}</span>
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4" />
                <span>Upload & Queue Ingestion</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Submitted Jobs Section */}
      {submittedJobIds.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-foreground">
            Active & Recent Ingestion Jobs ({submittedJobIds.length})
          </h4>
          <div className="space-y-3">
            {submittedJobIds.map((id) => (
              <JobStatusTracker key={id} jobId={id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
