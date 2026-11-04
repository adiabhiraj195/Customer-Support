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
  const [hydeEnabled, setHydeEnabled] = useState(false);
  const [showHydeDoc, setShowHydeDoc] = useState(false);
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
        HyDE: hydeEnabled,
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
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Stateless RAG Retrieval & Inference</span>
          </div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">
            Playground & Pipeline Diagnostics
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Test vector retrieval, BM25 keyword search, reciprocal rank fusion, Cohere reranking, and Groq generation directly without persisting to PostgreSQL.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive-subtle p-3 text-xs text-destructive-subtle-foreground border border-destructive-border">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{(error as Error)?.message}</span>
          </div>
        )}

        <form onSubmit={handleQuery} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Test Prompt / Query
            </label>
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What were the total operational expenses in Q2?"
              className="w-full rounded-xl border border-input bg-muted/40 px-4 py-2.5 text-sm text-foreground placeholder:text-subtle-foreground focus:border-primary focus:bg-background focus:outline-none"
            />
          </div>

          {/* Hyperparameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Top-K Chunks
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:border-primary focus:bg-background focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                RRF Smoothing (k)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={rrfK}
                onChange={(e) => setRrfK(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:border-primary focus:bg-background focus:outline-none"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={filterUserOnly}
                  onChange={(e) => setFilterUserOnly(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span>Scope to current user docs</span>
              </label>
            </div>
          </div>

          {/* HyDE Option Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/30">
            <div className="flex items-start gap-2.5">
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  hydeEnabled
                    ? "bg-primary-subtle text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    HyDE (Hypothetical Document Embeddings)
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase transition-colors ${
                      hydeEnabled
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {hydeEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Rewrite query into an authoritative hypothetical document before vector retrieval for higher semantic match accuracy.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHydeEnabled(!hydeEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                hydeEnabled ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              role="switch"
              aria-checked={hydeEnabled}
              title="Toggle HyDE Query Rewrite"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  hydeEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-2.5 text-xs shadow-xs transition disabled:opacity-50"
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
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h4 className="text-sm font-bold text-foreground">
              Pipeline Output
            </h4>
            {responseData.pipelineStats?.durationMs && (
              <span className="flex items-center gap-1 text-xs text-primary font-medium">
                <Clock className="h-3.5 w-3.5" />
                {responseData.pipelineStats.durationMs}ms
              </span>
            )}
          </div>

          {/* HyDE / Rewritten Query Banner */}
          {(responseData.hydeApplied || responseData.queryRewriteStatus === "hyde") ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs bg-primary-subtle text-primary border border-primary-border p-2.5 rounded-xl font-medium">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>HyDE Applied (Hypothetical Document Embeddings)</span>
                </div>
                {responseData.hypotheticalDocument && (
                  <button
                    type="button"
                    onClick={() => setShowHydeDoc(!showHydeDoc)}
                    className="text-[11px] font-semibold underline underline-offset-2 hover:opacity-80 transition cursor-pointer"
                  >
                    {showHydeDoc ? "Hide Hypothetical Passage" : "View Hypothetical Passage"}
                  </button>
                )}
              </div>
              {showHydeDoc && responseData.hypotheticalDocument && (
                <div className="p-3 rounded-xl bg-muted text-[11px] font-mono text-foreground border border-border whitespace-pre-wrap max-h-56 overflow-y-auto">
                  {responseData.hypotheticalDocument}
                </div>
              )}
            </div>
          ) : (
            responseData.rewrittenQuery &&
            responseData.rewrittenQuery !== responseData.originalQuery && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-xl border border-border">
                <CornerDownRight className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold">Rewritten Query:</span>
                <span>&quot;{responseData.rewrittenQuery}&quot;</span>
              </div>
            )
          )}

          {/* Clarification Alert if model asked for clarify */}
          {isClarification && (
            <div className="flex items-center gap-2 rounded-xl bg-warning-subtle p-3 text-xs text-warning-subtle-foreground border border-warning-border">
              <AlertCircle className="h-4 w-4 text-warning shrink-0" />
              <span>
                <strong>Clarification Required:</strong>{" "}
                {responseData.clarification || responseData.answer}
              </span>
            </div>
          )}

          {/* Synthesized Answer */}
          {responseData.answer && !isClarification && (
            <div className="p-4 rounded-xl bg-primary-subtle/50 border border-primary-border">
              <span className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-2">
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
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                {showRawContext ? "Hide Raw Context" : "View Injected Raw Context"}
              </button>
              {showRawContext && (
                <pre className="mt-2 p-3 rounded-xl bg-card border border-border text-foreground text-[11px] font-mono whitespace-pre-wrap overflow-x-auto max-h-60">
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
