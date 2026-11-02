"use client";

import { useState } from "react";
import { Loader2, Send, Sliders, Sparkles } from "lucide-react";
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
  const [hydeEnabled, setHydeEnabled] = useState(false);
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
        HyDE: hydeEnabled,
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
        <div className="mb-3 p-3.5 rounded-xl border border-border bg-muted/50 space-y-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
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

          {/* HyDE Detailed Toggle in Settings */}
          <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
            <div className="flex items-start gap-2 max-w-md">
              <Sparkles className={`h-4 w-4 shrink-0 mt-0.5 ${hydeEnabled ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">
                    HyDE Query Rewrite
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                    hydeEnabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {hydeEnabled ? "Active" : "Standard"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Rewrites your prompt into a hypothetical answer before vector search for higher accuracy.
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

        {/* Quick HyDE Toggle Button on Input Bar */}
        <button
          type="button"
          onClick={() => setHydeEnabled(!hydeEnabled)}
          className={`flex h-10 shrink-0 items-center gap-1.5 px-2.5 sm:px-3 rounded-xl border text-xs font-medium transition-all ${
            hydeEnabled
              ? "border-primary bg-primary-subtle text-primary ring-1 ring-primary/30"
              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title={
            hydeEnabled
              ? "HyDE is ON: Hypothetical Document Embeddings enabled for query rewriting. Click to turn off."
              : "HyDE is OFF: Standard query rewriting active. Click to enable HyDE."
          }
          aria-label="Toggle HyDE Query Rewrite"
          aria-pressed={hydeEnabled}
        >
          <Sparkles
            className={`h-3.5 w-3.5 ${
              hydeEnabled ? "text-primary fill-primary/20 animate-pulse" : "text-muted-foreground"
            }`}
          />
          <span className="font-semibold">HyDE</span>
          <span
            className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase transition-colors ${
              hydeEnabled
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {hydeEnabled ? "ON" : "OFF"}
          </span>
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
