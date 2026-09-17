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
    <div className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-3 sm:p-4 backdrop-blur-md">
      {showSettings && (
        <div className="mb-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <label className="font-medium text-zinc-600 dark:text-zinc-400">
              Top-K Chunks:
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-16 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium text-zinc-600 dark:text-zinc-400">
              RRF Constant K:
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={rrfK}
              onChange={(e) => setRrfK(Number(e.target.value))}
              className="w-16 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <span className="text-[11px] text-zinc-400">
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
              ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
              : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
            className="w-full resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition max-h-32"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || disabled || isSending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition"
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

