"use client";

import { useState } from "react";
import { Activity, Clock } from "lucide-react";
import { PipelineStats } from "@/types/api";

export function PipelineStatsBadge({ stats }: { stats?: PipelineStats }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!stats) return null;

  return (
    <div className="mt-2 text-[11px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-medium bg-muted hover:bg-muted/80 text-foreground transition"
      >
        <Activity className="h-3 w-3 text-success" />
        <span>RAG Pipeline</span>
        {stats.durationMs !== undefined && (
          <span className="text-subtle-foreground">
            • {stats.durationMs}ms
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-1.5 p-2.5 rounded-lg border border-border bg-card/90 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {stats.semanticRetrieved !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-subtle-foreground">Semantic Chunks</span>
              <span className="font-semibold text-foreground">
                {stats.semanticRetrieved}
              </span>
            </div>
          )}
          {stats.lexicalRetrieved !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-subtle-foreground">BM25 Lexical</span>
              <span className="font-semibold text-foreground">
                {stats.lexicalRetrieved}
              </span>
            </div>
          )}
          {stats.rrfCandidates !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-subtle-foreground">RRF Candidates</span>
              <span className="font-semibold text-foreground">
                {stats.rrfCandidates}
              </span>
            </div>
          )}
          {stats.rerankedChunks !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-subtle-foreground">Cohere Reranked</span>
              <span className="font-semibold text-foreground">
                {stats.rerankedChunks}
              </span>
            </div>
          )}
          {stats.passedThresholdChunks !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-subtle-foreground">Passed Threshold</span>
              <span className="font-semibold text-success">
                {stats.passedThresholdChunks} (min {stats.scoreThreshold ?? 0.6})
              </span>
            </div>
          )}
          {stats.durationMs !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-subtle-foreground">Latency</span>
              <span className="font-semibold text-primary flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats.durationMs}ms
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
