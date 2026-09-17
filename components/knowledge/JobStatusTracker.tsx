"use client";

import { CheckCircle2, FileCheck, Loader2, XCircle } from "lucide-react";
import { useJobStatus } from "@/hooks/useIngestion";

export function JobStatusTracker({ jobId }: { jobId: string }) {
  const { job, isLoading, isError, error, isCompleted, isFailed } =
    useJobStatus(jobId);

  if (isLoading && !job) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span>Fetching job #{jobId} status from BullMQ queue...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-400">
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
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isCompleted
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : isFailed
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : isFailed ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Ingestion Job #{job.jobId}
            </h4>
            <span className="text-[11px] text-zinc-400 capitalize">
              State: {job.state}
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
            isCompleted
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : isFailed
              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 animate-pulse"
          }`}
        >
          {job.state}
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-zinc-500 mb-1 font-medium">
          <span>Processing & Embedding Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isCompleted
                ? "bg-emerald-500"
                : isFailed
                ? "bg-rose-500"
                : "bg-blue-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Details Result Box */}
      {job.result && (
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200">
            <FileCheck className="h-4 w-4 text-emerald-500" />
            <span>Successfully indexed into Redis Vector Store</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <div>
              Total Chunks:{" "}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {job.result.totalChunks}
              </span>
            </div>
            <div>
              Version:{" "}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                v{job.result.version}
              </span>
            </div>
            {job.result.processedAt && (
              <div className="col-span-2 sm:col-span-1 truncate">
                Processed:{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {new Date(job.result.processedAt).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {job.failedReason && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-400">
          <strong>Failure Reason:</strong> {job.failedReason}
        </div>
      )}
    </div>
  );
}

