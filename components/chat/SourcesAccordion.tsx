"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { MessageSource } from "@/types/api";

export function SourcesAccordion({ sources }: { sources?: MessageSource[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 overflow-hidden text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 transition font-medium"
      >
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Cited Sources ({sources.length})</span>
        </span>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800 px-3 pb-2 pt-1 space-y-2">
          {sources.map((source, idx) => {
            const relevancePct = Math.round(source.relevanceScore * 100);
            return (
              <div key={source.chunkId || idx} className="pt-2 first:pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-[10px] text-blue-700 dark:text-blue-300 font-bold">
                      {source.index || idx + 1}
                    </span>
                    {source.filename}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      relevancePct >= 80
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : relevancePct >= 60
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {relevancePct}% match
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-950/60 p-2 rounded-lg border border-zinc-200/50 dark:border-zinc-800/80 line-clamp-4 hover:line-clamp-none transition-all">
                  {source.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

