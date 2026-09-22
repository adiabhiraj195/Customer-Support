"use client";

import { useEffect, useRef } from "react";
import { Bot, ChevronLeft, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversations";
import { useUIStore } from "@/stores/uiStore";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { SendMessageRequest } from "@/types/api";
import { AuthRequiredCard } from "@/components/auth/AuthRequiredCard";

export function ChatArea() {
  const { isAuthenticated } = useAuth();
  const { selectedConversationId, setSelectedConversationId } = useUIStore();
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
      <AuthRequiredCard
        title="Authentication Required"
        description="Sign in to load your conversations or start a new persistent chat with the RAG knowledge assistant."
        className="min-h-0 h-full"
      />
    );
  }

  if (!selectedConversationId) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-6 text-center text-muted-foreground h-full min-h-0 bg-background/50">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-3">
          <MessageSquare className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">
          No Conversation Selected
        </h3>
        <p className="text-xs text-muted-foreground max-w-xs mb-3">
          Select an existing conversation from the sidebar or start a new one to chat with the knowledge base.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full min-h-0">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-xs">Loading message history...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center h-full min-h-0">
        <div className="max-w-md rounded-2xl border border-destructive-border bg-destructive-subtle p-6 text-destructive-subtle-foreground">
          <h4 className="font-semibold text-sm mb-1">Failed to load conversation</h4>
          <p className="text-xs">{(error as Error)?.message || "Unknown error occurred"}</p>
        </div>
      </div>
    );
  }

  const messages = conversation?.messages || [];

  return (
    <div className="flex flex-1 flex-col h-full min-h-0 overflow-hidden bg-card">
      {/* Thread Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-border px-4 sm:px-6 py-3 bg-card/70 backdrop-blur-xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setSelectedConversationId(null)}
            className="md:hidden flex items-center justify-center h-8 w-8 -ml-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 transition"
            title="Back to conversations"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground truncate max-w-md">
              {conversation?.title || "Conversation"}
            </h2>
            <span className="text-[11px] text-muted-foreground">
              {messages.length} message{messages.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Stream - ONLY THIS CONTAINER SCROLLS */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium text-foreground">
              Start this conversation
            </p>
            <p className="text-xs text-muted-foreground max-w-xs mt-1">
              Ask questions about ingested documents, policies, reports, or data.
            </p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}

        {/* Assistant Thinking / Inferencing Indicator */}
        {isSending && (
          <div className="flex items-start gap-3 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs mt-0.5">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-border bg-card px-4 py-3 text-xs text-muted-foreground shadow-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Retrieving chunks & synthesizing answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar - FIRMLY FIXED AT BOTTOM */}
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
