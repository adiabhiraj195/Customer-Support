"use client";

import { CheckCircle2, Clock, FileX, Files } from "lucide-react";
import { DocumentItem } from "@/types/api";

interface DocumentStatsCardsProps {
  documents: DocumentItem[];
  totalCount?: number;
}

export function DocumentStatsCards({
  documents,
  totalCount,
}: DocumentStatsCardsProps) {
  const completedCount = documents.filter(
    (d) => d.status === "COMPLETED"
  ).length;
  const processingCount = documents.filter(
    (d) => d.status === "PROCESSING" || d.status === "PENDING"
  ).length;
  const failedCount = documents.filter((d) => d.status === "FAILED").length;

  const displayTotal = totalCount ?? documents.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Documents */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition hover:border-border-strong">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Total Files
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <Files className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {displayTotal}
          </span>
          <span className="text-[11px] text-muted-foreground">in knowledge base</span>
        </div>
      </div>

      {/* Indexed / Completed */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition hover:border-border-strong">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Indexed & Ready
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-success-subtle text-success">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-success">
            {completedCount}
          </span>
          <span className="text-[11px] text-muted-foreground">active in RAG</span>
        </div>
      </div>

      {/* Processing / Queued */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition hover:border-border-strong">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Processing / Queued
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-warning-subtle text-warning">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-warning">
            {processingCount}
          </span>
          <span className="text-[11px] text-muted-foreground">in BullMQ queue</span>
        </div>
      </div>

      {/* Failed Ingestions */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition hover:border-border-strong">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Failed Ingestion
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-destructive-subtle text-destructive">
            <FileX className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-destructive">
            {failedCount}
          </span>
          <span className="text-[11px] text-muted-foreground">attention needed</span>
        </div>
      </div>
    </div>
  );
}
