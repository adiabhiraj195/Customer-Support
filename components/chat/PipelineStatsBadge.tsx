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
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium bg-card-muted hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition-all shadow-2xs"
      >
        <Activity className="h-3 w-3 text-success" />
        <span>RAG Pipeline</span>
        {stats.durationMs !== undefined && (
          <span className="text-muted-foreground font-mono">
            • {stats.durationMs}ms
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 p-3 rounded-xl border border-border bg-card-muted/60 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {stats.semanticRetrieved !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground">Semantic Chunks</span>
              <span className="font-semibold text-foreground font-mono">
                {stats.semanticRetrieved}
              </span>
            </div>
          )}
          {stats.lexicalRetrieved !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground">BM25 Lexical</span>
              <span className="font-semibold text-foreground font-mono">
                {stats.lexicalRetrieved}
              </span>
            </div>
          )}
          {stats.rrfCandidates !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground">RRF Candidates</span>
              <span className="font-semibold text-foreground font-mono">
                {stats.rrfCandidates}
              </span>
            </div>
          )}
          {stats.rerankedChunks !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground">Cohere Reranked</span>
              <span className="font-semibold text-foreground font-mono">
                {stats.rerankedChunks}
              </span>
            </div>
          )}
          {stats.passedThresholdChunks !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground">Passed Threshold</span>
              <span className="font-semibold text-success font-mono">
                {stats.passedThresholdChunks} (min {stats.scoreThreshold ?? 0.6})
              </span>
            </div>
          )}
          {stats.durationMs !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground">Latency</span>
              <span className="font-semibold text-primary flex items-center gap-1 font-mono">
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
