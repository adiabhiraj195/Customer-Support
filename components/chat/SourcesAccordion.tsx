"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { MessageSource } from "@/types/api";

export function SourcesAccordion({ sources }: { sources?: MessageSource[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-border bg-card-muted/50 overflow-hidden text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-foreground hover:bg-accent transition font-medium"
      >
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span>Cited Sources ({sources.length})</span>
        </span>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="divide-y divide-border px-3 pb-2 pt-1 space-y-2">
          {sources.map((source, idx) => {
            const relevancePct = Math.round(source.relevanceScore * 100);
            return (
              <div key={source.chunkId || idx} className="pt-2 first:pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-subtle text-[10px] text-primary font-bold">
                      {source.index || idx + 1}
                    </span>
                    <span className="truncate max-w-[200px] sm:max-w-xs">{source.filename}</span>
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                      relevancePct >= 80
                        ? "bg-success-subtle text-success-subtle-foreground border-success-border"
                        : relevancePct >= 60
                        ? "bg-primary-subtle text-primary-subtle-foreground border-primary/20"
                        : "bg-warning-subtle text-warning-subtle-foreground border-warning-border"
                    }`}
                  >
                    {relevancePct}% match
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground bg-card p-2.5 rounded-lg border border-border line-clamp-4 hover:line-clamp-none transition-all">
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
