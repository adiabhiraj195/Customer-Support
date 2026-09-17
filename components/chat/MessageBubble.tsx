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
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm mt-0.5">
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
          <div className="mb-1 flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md">
            <CornerDownRight className="h-3 w-3 text-blue-500" />
            <span className="font-medium">Query Rewritten:</span>
            <span className="italic truncate max-w-xs sm:max-w-md">
              &quot;{metadata.rewrittenQuery}&quot;
            </span>
          </div>
        )}

        {/* Clarification Alert Banner */}
        {!isUser && isClarify && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-2 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>The assistant needs clarification to answer accurately.</span>
          </div>
        )}

        {/* Message Content Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-xs"
              : "bg-white dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/60 rounded-tl-xs"
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
        <span className="mt-1 px-1 text-[10px] text-zinc-400 dark:text-zinc-500 select-none">
          {formattedTime}
        </span>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold text-xs mt-0.5">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

