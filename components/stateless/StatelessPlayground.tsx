"use client";

import { useState } from "react";
import {
  AlertCircle,
  Clock,
  CornerDownRight,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";
import { useStatelessChat } from "@/hooks/useStatelessChat";
import { useAuthStore } from "@/stores/authStore";
import { SourcesAccordion } from "@/components/chat/SourcesAccordion";
import { PipelineStatsBadge } from "@/components/chat/PipelineStatsBadge";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";

export function StatelessPlayground() {
  const { ask, isLoading, error, data } = useStatelessChat();
  const { user } = useAuthStore();

  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [rrfK, setRrfK] = useState(60);
  const [filterUserOnly, setFilterUserOnly] = useState(false);
  const [showRawContext, setShowRawContext] = useState(false);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    try {
      await ask({
        query: query.trim(),
        topK: Number(topK),
        rrfK: Number(rrfK),
        userId: filterUserOnly && user?.id ? user.id : undefined,
      });
    } catch {
      // Error handled by mutation
    }
  };

  const responseData = data?.data;
  const isClarification =
    data?.status === "clarify" || responseData?.status === "clarify";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Playground Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Stateless RAG Retrieval & Inference</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Playground & Pipeline Diagnostics
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Test vector retrieval, BM25 keyword search, reciprocal rank fusion, Cohere reranking, and Groq generation directly without persisting to PostgreSQL.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{(error as Error)?.message}</span>
          </div>
        )}

        <form onSubmit={handleQuery} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Test Prompt / Query
            </label>
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What were the total operational expenses in Q2?"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Hyperparameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Top-K Chunks
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                RRF Smoothing (k)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={rrfK}
                onChange={(e) => setRrfK(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={filterUserOnly}
                  onChange={(e) => setFilterUserOnly(e.target.checked)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Scope to current user docs</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 text-xs shadow-sm transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Hybrid Retrieval & Inference...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Run Stateless Query</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Response Display */}
      {responseData && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Pipeline Output
            </h4>
            {responseData.pipelineStats?.durationMs && (
              <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                <Clock className="h-3.5 w-3.5" />
                {responseData.pipelineStats.durationMs}ms
              </span>
            )}
          </div>

          {/* Rewritten query banner if any */}
          {responseData.rewrittenQuery &&
            responseData.rewrittenQuery !== responseData.originalQuery && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <CornerDownRight className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-semibold">Rewritten Query:</span>
                <span>&quot;{responseData.rewrittenQuery}&quot;</span>
              </div>
            )}

          {/* Clarification Alert if model asked for clarify */}
          {isClarification && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              <span>
                <strong>Clarification Required:</strong>{" "}
                {responseData.clarification || responseData.answer}
              </span>
            </div>
          )}

          {/* Synthesized Answer */}
          {responseData.answer && !isClarification && (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
              <span className="block text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2">
                Synthesized Answer
              </span>
              <MarkdownRenderer content={responseData.answer} />
            </div>
          )}

          {/* Sources Accordion */}
          {responseData.sources && (
            <SourcesAccordion sources={responseData.sources} />
          )}

          {/* Pipeline Stats */}
          {responseData.pipelineStats && (
            <PipelineStatsBadge stats={responseData.pipelineStats} />
          )}

          {/* Raw Context Toggle */}
          {responseData.context && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowRawContext(!showRawContext)}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                {showRawContext ? "Hide Raw Context" : "View Injected Raw Context"}
              </button>
              {showRawContext && (
                <pre className="mt-2 p-3 rounded-xl bg-zinc-900 text-zinc-100 text-[11px] font-mono whitespace-pre-wrap overflow-x-auto max-h-60">
                  {responseData.context}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

