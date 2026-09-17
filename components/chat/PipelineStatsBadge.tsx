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
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400 transition"
      >
        <Activity className="h-3 w-3 text-emerald-500" />
        <span>RAG Pipeline</span>
        {stats.durationMs !== undefined && (
          <span className="text-zinc-400 dark:text-zinc-500">
            • {stats.durationMs}ms
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-1.5 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {stats.semanticRetrieved !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400">Semantic Chunks</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {stats.semanticRetrieved}
              </span>
            </div>
          )}
          {stats.lexicalRetrieved !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400">BM25 Lexical</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {stats.lexicalRetrieved}
              </span>
            </div>
          )}
          {stats.rrfCandidates !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400">RRF Candidates</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {stats.rrfCandidates}
              </span>
            </div>
          )}
          {stats.rerankedChunks !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400">Cohere Reranked</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {stats.rerankedChunks}
              </span>
            </div>
          )}
          {stats.passedThresholdChunks !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400">Passed Threshold</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {stats.passedThresholdChunks} (min {stats.scoreThreshold ?? 0.6})
              </span>
            </div>
          )}
          {stats.durationMs !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400">Latency</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
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

