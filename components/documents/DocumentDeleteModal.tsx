"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { DocumentItem } from "@/types/api";

interface DocumentDeleteModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function DocumentDeleteModal({
  document,
  onClose,
  onConfirm,
  isDeleting,
}: DocumentDeleteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    if (document) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [document, isDeleting, onClose]);

  if (!document) return null;

  const handleDelete = async () => {
    await onConfirm(document.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isDeleting) onClose();
        }}
      />

      {/* Dialog Box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-destructive-border bg-card p-6 shadow-xl space-y-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive-subtle text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <h3
            id="delete-dialog-title"
            className="text-base font-bold text-foreground"
          >
            Delete Document
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-foreground break-all">
              &ldquo;{document.filename}&rdquo;
            </span>
            ?
          </p>
        </div>

        <div className="rounded-xl bg-destructive-subtle/50 border border-destructive-border/50 p-3 text-xs text-destructive-subtle-foreground space-y-1">
          <p className="font-semibold text-[11px]">This action cannot be undone:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
            <li>File record will be removed from PostgreSQL database</li>
            <li>Raw storage object will be deleted from Amazon S3</li>
            <li>All associated vector embeddings and chunk index will be evicted</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 text-xs font-medium shadow-xs transition disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Document</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
