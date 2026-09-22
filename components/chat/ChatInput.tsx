"use client";

import { useState } from "react";
import { Loader2, Send, Sliders } from "lucide-react";
import { SendMessageRequest } from "@/types/api";

interface ChatInputProps {
  onSendMessage: (req: SendMessageRequest) => Promise<void>;
  disabled?: boolean;
  isSending?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  isSending = false,
  placeholder = "Ask anything from your knowledge base...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [topK, setTopK] = useState(5);
  const [rrfK, setRrfK] = useState(60);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending || disabled) return;

    setInput("");
    try {
      await onSendMessage({
        message: trimmed,
        topK: Number(topK),
        rrfK: Number(rrfK),
      });
    } catch {
      // Retain input if failed
      setInput(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="shrink-0 w-full border-t border-border bg-card/95 p-3 sm:p-4 backdrop-blur-md">
      {showSettings && (
        <div className="mb-3 p-3 rounded-xl border border-border bg-muted/50 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <label className="font-medium text-muted-foreground">
              Top-K Chunks:
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-16 rounded-md border border-input bg-background px-2 py-1 text-center font-mono focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium text-muted-foreground">
              RRF Constant K:
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={rrfK}
              onChange={(e) => setRrfK(Number(e.target.value))}
              className="w-16 rounded-md border border-input bg-background px-2 py-1 text-center font-mono focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>

          <span className="text-[11px] text-subtle-foreground">
            Controls reciprocal rank fusion and max context size for retrieval.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            showSettings
              ? "border-primary bg-primary-subtle text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
          title="Retrieval Hyperparameters"
        >
          <Sliders className="h-4 w-4" />
        </button>

        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isSending}
            rows={1}
            placeholder={placeholder}
            className="w-full resize-none rounded-xl border border-input bg-muted/40 px-4 py-2.5 text-sm text-foreground placeholder:text-subtle-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none transition max-h-32"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || disabled || isSending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover disabled:opacity-40 disabled:hover:bg-primary transition"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}
