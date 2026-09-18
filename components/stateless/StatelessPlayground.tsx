"use client";

import { useState } from "react";
import {
  AlertCircle,
  Clock,
  CornerDownRight,
  Send,
  Sparkles,
} from "lucide-react";
import { useStatelessChat } from "@/hooks/useStatelessChat";
import { useAuthStore } from "@/stores/authStore";
import { SourcesAccordion } from "@/components/chat/SourcesAccordion";
import { PipelineStatsBadge } from "@/components/chat/PipelineStatsBadge";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
      <Card className="p-6 sm:p-8 space-y-6">
        <div>
          <Badge variant="default" size="md" className="mb-2.5">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span>Stateless RAG Retrieval & Inference</span>
          </Badge>
          <CardTitle>Playground & Pipeline Diagnostics</CardTitle>
          <CardDescription className="mt-1">
            Test vector retrieval, BM25 keyword search, reciprocal rank fusion, Cohere reranking, and Groq generation directly without persisting to PostgreSQL.
          </CardDescription>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive-subtle p-3 text-xs text-destructive-subtle-foreground border border-destructive-border">
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
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
              className="w-full rounded-xl border border-border bg-card-muted/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition shadow-2xs"
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
                className="w-full rounded-xl border border-border bg-card-muted/60 px-3 py-1.5 text-xs text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
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
                className="w-full rounded-xl border border-border bg-card-muted/60 px-3 py-1.5 text-xs text-foreground focus:bg-card focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none">
                <input
                  type="checkbox"
                  checked={filterUserOnly}
                  onChange={(e) => setFilterUserOnly(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <span>Scope to current user docs</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            isLoading={isLoading}
            leftIcon={<Send className="h-4 w-4" />}
            className="w-full"
            size="md"
          >
            Run Stateless Query
          </Button>
        </form>
      </Card>

      {/* Response Display */}
      {responseData && (
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h4 className="text-sm font-bold text-foreground">
              Pipeline Output
            </h4>
            {responseData.pipelineStats?.durationMs && (
              <span className="flex items-center gap-1 text-xs text-primary font-semibold font-mono">
                <Clock className="h-3.5 w-3.5" />
                {responseData.pipelineStats.durationMs}ms
              </span>
            )}
          </div>

          {/* Rewritten query banner if any */}
          {responseData.rewrittenQuery &&
            responseData.rewrittenQuery !== responseData.originalQuery && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card-muted p-2.5 rounded-xl border border-border">
                <CornerDownRight className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold text-foreground">Rewritten Query:</span>
                <span>&quot;{responseData.rewrittenQuery}&quot;</span>
              </div>
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
            <div className="p-4 rounded-xl bg-primary-subtle border border-primary/25">
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
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {showRawContext ? "Hide Raw Context" : "View Injected Raw Context"}
              </button>
              {showRawContext && (
                <pre className="mt-2 p-3.5 rounded-xl bg-zinc-950 text-zinc-100 text-[11px] font-mono whitespace-pre-wrap overflow-x-auto max-h-60 border border-border">
                  {responseData.context}
                </pre>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
