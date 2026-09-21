"use client";

import { CheckCircle2, FileCheck, Loader2, XCircle } from "lucide-react";
import { useJobStatus } from "@/hooks/useIngestion";

export function JobStatusTracker({ jobId }: { jobId: string }) {
  const { job, isLoading, isError, error, isCompleted, isFailed } =
    useJobStatus(jobId);

  if (isLoading && !job) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-xl border border-border bg-card text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Fetching job #{jobId} status from BullMQ queue...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-xl border border-destructive-border bg-destructive-subtle text-xs text-destructive-subtle-foreground">
        <div className="flex items-center gap-2 font-medium">
          <XCircle className="h-4 w-4" />
          <span>Job #{jobId} not found or Redis error</span>
        </div>
        <p className="mt-1">{(error as Error)?.message}</p>
      </div>
    );
  }

  if (!job) return null;

  const progress = job.progress ?? (isCompleted ? 100 : 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isCompleted
                ? "bg-success-subtle text-success-subtle-foreground"
                : isFailed
                ? "bg-destructive-subtle text-destructive-subtle-foreground"
                : "bg-primary-subtle text-primary-subtle-foreground"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : isFailed ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Ingestion Job #{job.jobId}
            </h4>
            <span className="text-[11px] text-muted-foreground capitalize">
              State: {job.state}
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
            isCompleted
              ? "bg-success-subtle text-success-subtle-foreground"
              : isFailed
              ? "bg-destructive-subtle text-destructive-subtle-foreground"
              : "bg-warning-subtle text-warning-subtle-foreground animate-pulse"
          }`}
        >
          {job.state}
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1 font-medium">
          <span>Processing & Embedding Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isCompleted
                ? "bg-success"
                : isFailed
                ? "bg-destructive"
                : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Details Result Box */}
      {job.result && (
        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <FileCheck className="h-4 w-4 text-success" />
            <span>Successfully indexed into Redis Vector Store</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-muted-foreground">
            <div>
              Total Chunks:{" "}
              <span className="font-semibold text-foreground">
                {job.result.totalChunks}
              </span>
            </div>
            <div>
              Version:{" "}
              <span className="font-semibold text-foreground">
                v{job.result.version}
              </span>
            </div>
            {job.result.processedAt && (
              <div className="col-span-2 sm:col-span-1 truncate">
                Processed:{" "}
                <span className="font-semibold text-foreground">
                  {new Date(job.result.processedAt).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {job.failedReason && (
        <div className="p-3 rounded-xl bg-destructive-subtle border border-destructive-border text-xs text-destructive-subtle-foreground">
          <strong>Failure Reason:</strong> {job.failedReason}
        </div>
      )}
    </div>
  );
}
