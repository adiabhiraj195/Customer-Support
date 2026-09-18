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
import { Button } from "@/components/ui/Button";

export function ChatArea() {
  const { isAuthenticated, user } = useAuth();
  const isAgentPending =
    user?.role === "Support Agent" && user?.status === "PENDING_APPROVAL";

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
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-background">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary mb-3">
          <Bot className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">
          Authentication Required
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-4">
          Sign in to load your conversations or start a new persistent chat with the RAG knowledge assistant.
        </p>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedConversationId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-muted-foreground bg-background">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card-muted mb-3 border border-border">
          <MessageSquare className="h-7 w-7 opacity-50 text-foreground" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">
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
      <div className="flex flex-1 items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-xs">Loading message history...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center bg-background">
        <div className="max-w-md rounded-2xl border border-destructive-border bg-destructive-subtle p-6 text-destructive-subtle-foreground">
          <h4 className="font-bold text-sm mb-1">Failed to load conversation</h4>
          <p className="text-xs">{(error as Error)?.message || "Unknown error occurred"}</p>
        </div>
      </div>
    );
  }

  const messages = conversation?.messages || [];

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden bg-background">
      {/* Thread Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-3 bg-card/80 backdrop-blur-xs">
        <div>
          <h2 className="text-sm font-bold text-foreground truncate max-w-md">
            {conversation?.title || "Conversation"}
          </h2>
          <span className="text-[11px] text-muted-foreground">
            {messages.length} message{messages.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-semibold text-foreground">
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xs mt-0.5">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-border bg-card px-4 py-3 text-xs text-muted-foreground shadow-2xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
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
        disabled={isLoading || isAgentPending}
        placeholder={
          isAgentPending
            ? "Your Support Agent account is awaiting Admin approval. Messaging is disabled."
            : undefined
        }
      />
    </div>
  );
}
