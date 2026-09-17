"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Bot, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversations";
import { useUIStore } from "@/stores/uiStore";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { SendMessageRequest } from "@/types/api";

export function ChatArea() {
  const { isAuthenticated } = useAuth();
  const { selectedConversationId } = useUIStore();
  const {
    conversation,
    isLoading,
    isError,
    error,
    sendMessage,
    isSending,
  } = useConversation(selectedConversationId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isSending]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 mb-3">
          <Bot className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
          Authentication Required
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mb-4">
          Sign in to load your conversations or start a new persistent chat with the RAG knowledge assistant.
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedConversationId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-zinc-400">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 mb-3">
          <MessageSquare className="h-7 w-7 text-zinc-400" />
        </div>
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
          No Conversation Selected
        </h3>
        <p className="text-xs text-zinc-500 max-w-xs mb-3">
          Select an existing conversation from the sidebar or start a new one to chat with the knowledge base.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-zinc-400">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-xs">Loading message history...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30 p-6 text-rose-700 dark:text-rose-400">
          <h4 className="font-semibold text-sm mb-1">Failed to load conversation</h4>
          <p className="text-xs">{(error as Error)?.message || "Unknown error occurred"}</p>
        </div>
      </div>
    );
  }

  const messages = conversation?.messages || [];

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden bg-white dark:bg-zinc-900">
      {/* Thread Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-3 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xs">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate max-w-md">
            {conversation?.title || "Conversation"}
          </h2>
          <span className="text-[11px] text-zinc-400">
            {messages.length} message{messages.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 py-12">
            <Sparkles className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Start this conversation
            </p>
            <p className="text-xs text-zinc-400 max-w-xs mt-1">
              Ask questions about ingested documents, policies, reports, or data.
            </p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}

        {/* Assistant Thinking / Inferencing Indicator */}
        {isSending && (
          <div className="flex items-start gap-3 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm mt-0.5">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/90 px-4 py-3 text-xs text-zinc-500 shadow-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
              <span>Retrieving chunks & synthesizing answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <ChatInput
        onSendMessage={async (req: SendMessageRequest) => {
          await sendMessage(req);
        }}
        isSending={isSending}
        disabled={isLoading}
      />
    </div>
  );
}

