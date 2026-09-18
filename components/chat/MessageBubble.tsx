"use client";

import { AlertCircle, Bot, CornerDownRight, User } from "lucide-react";
import { Message } from "@/types/api";
import { SourcesAccordion } from "./SourcesAccordion";
import { PipelineStatsBadge } from "./PipelineStatsBadge";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const metadata = message.metadata;
  const isClarify = metadata?.queryRewriteStatus === "clarify";

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex w-full gap-3 py-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xs mt-0.5">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* Rewritten Query Tag */}
        {!isUser && metadata?.rewrittenQuery && metadata.rewrittenQuery !== metadata.originalQuery && (
          <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground bg-card-muted px-2.5 py-1 rounded-lg border border-border">
            <CornerDownRight className="h-3 w-3 text-primary" />
            <span className="font-semibold text-foreground">Query Rewritten:</span>
            <span className="italic truncate max-w-xs sm:max-w-md">
              &quot;{metadata.rewrittenQuery}&quot;
            </span>
          </div>
        )}

        {/* Clarification Alert Banner */}
        {!isUser && isClarify && (
          <div className="mb-2 flex items-center gap-2 rounded-xl bg-warning-subtle border border-warning-border p-2.5 text-xs text-warning-subtle-foreground shadow-2xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
            <span>The assistant needs clarification to answer accurately.</span>
          </div>
        )}

        {/* Message Content Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-xs"
              : "bg-card text-card-foreground border border-border rounded-tl-xs"
          }`}
        >
          <MarkdownRenderer content={message.content} isUser={isUser} />

          {/* Sources Accordion */}
          {!isUser && metadata?.sources && metadata.sources.length > 0 && (
            <SourcesAccordion sources={metadata.sources} />
          )}

          {/* Pipeline Stats */}
          {!isUser && metadata?.pipelineStats && (
            <PipelineStatsBadge stats={metadata.pipelineStats} />
          )}
        </div>

        {/* Timestamp */}
        <span className="mt-1 px-1 text-[10px] text-muted-foreground select-none">
          {formattedTime}
        </span>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs mt-0.5 border border-border">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
