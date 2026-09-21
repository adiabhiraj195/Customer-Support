"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { DocumentItem } from "@/types/api";
import { useDocumentContent } from "@/hooks/useDocuments";

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
}

export function DocumentPreviewModal({
  document,
  onClose,
  onDownload,
}: DocumentPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const { data: contentData, isLoading, error } = useDocumentContent(
    document ? document.id : null
  );

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (document) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [document, onClose]);

  if (!document) return null;

  const handleCopy = async () => {
    if (!contentData?.content) return;
    try {
      await navigator.clipboard.writeText(contentData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback or ignore
    }
  };

  const lines = contentData?.content ? contentData.content.split("\n") : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-preview-title"
        className="relative z-10 flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3
                id="document-preview-title"
                className="text-sm sm:text-base font-bold text-foreground truncate"
                title={document.filename}
              >
                {document.filename}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  v{document.version}
                </span>
                <span>•</span>
                <span>{document.mimeType || "text/plain"}</span>
                {contentData?.charCount !== undefined && (
                  <>
                    <span>•</span>
                    <span>{contentData.charCount.toLocaleString()} chars</span>
                    <span>•</span>
                    <span>{lines.length} lines</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title="Close modal (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Technical Info Bar */}
        <div className="bg-muted/10 border-b border-border px-5 py-2 text-[11px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold">Doc ID:</span>
            <code className="font-mono bg-muted/60 px-1 py-0.5 rounded text-[10px] truncate max-w-xs sm:max-w-md">
              {document.id}
            </code>
          </div>
          <div className="truncate">
            <span className="font-semibold">Uploaded:</span>{" "}
            <span>{new Date(document.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[300px] max-h-[60vh] bg-background">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs">Fetching document content from S3...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 rounded-xl bg-destructive-subtle p-4 text-xs text-destructive-subtle-foreground border border-destructive-border">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                Failed to load document content:{" "}
                {error instanceof Error ? error.message : "Network error"}
              </span>
            </div>
          ) : contentData?.content ? (
            <div className="relative rounded-xl border border-border bg-card p-4 overflow-x-auto">
              <pre className="font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap select-text">
                {contentData.content}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-36 text-muted-foreground text-xs">
              <span>This document has empty content.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 bg-muted/20">
          <div className="text-xs text-muted-foreground">
            S3 Key:{" "}
            <span className="font-mono text-[10px] text-subtle-foreground truncate">
              {document.s3Key}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!contentData?.content}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" />
                  <span className="text-success">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDownload(document)}
              className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary-subtle text-primary hover:bg-primary-hover hover:text-primary-foreground px-3.5 py-1.5 text-xs font-medium transition shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

