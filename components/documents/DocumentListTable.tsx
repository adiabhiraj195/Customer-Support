"use client";

import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileCode,
  FileSpreadsheet,
  FileText,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { DocumentItem, DocumentPagination, DocumentStatus } from "@/types/api";

interface DocumentListTableProps {
  documents: DocumentItem[];
  pagination?: DocumentPagination;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onPreview: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
  hasFiltersApplied?: boolean;
  onClearFilters?: () => void;
}

export function DocumentListTable({
  documents,
  pagination,
  isLoading,
  onPageChange,
  onLimitChange,
  onPreview,
  onDownload,
  onDelete,
  hasFiltersApplied = false,
  onClearFilters,
}: DocumentListTableProps) {
  const getFileIcon = (filename: string, mimeType?: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "csv" || ext === "xlsx" || mimeType?.includes("csv")) {
      return <FileSpreadsheet className="h-4 w-4 text-emerald-500 shrink-0" />;
    }
    if (
      ext === "json" ||
      ext === "md" ||
      mimeType?.includes("json") ||
      mimeType?.includes("markdown")
    ) {
      return <FileCode className="h-4 w-4 text-blue-500 shrink-0" />;
    }
    return <FileText className="h-4 w-4 text-primary shrink-0" />;
  };

  const renderStatusBadge = (status: DocumentStatus | string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-subtle text-success-subtle-foreground border border-success-border">
            <CheckCircle2 className="h-3 w-3" />
            <span>Indexed</span>
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning-subtle text-warning-subtle-foreground border border-warning-border">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Processing</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-subtle text-primary-subtle-foreground border border-primary-border">
            <Clock className="h-3 w-3" />
            <span>Queued</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-destructive-subtle text-destructive-subtle-foreground border border-destructive-border">
            <AlertCircle className="h-3 w-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Skeleton rows for loading state
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="divide-y divide-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-48 rounded bg-muted" />
                  <div className="h-2.5 w-24 rounded bg-muted/60" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-16 rounded-full bg-muted" />
                <div className="h-6 w-24 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <UploadCloud className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">
          {hasFiltersApplied ? "No matching documents" : "No documents uploaded yet"}
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
          {hasFiltersApplied
            ? "No documents match your current search query or status filter. Try clearing filters."
            : "Upload documents into the knowledge base to power vector retrieval, semantic search, and AI grounded responses."}
        </p>
        <div className="flex items-center justify-center gap-3">
          {hasFiltersApplied && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition"
            >
              Clear Filters
            </button>
          )}
          <Link
            href="/knowledgebase"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 text-xs font-medium shadow-xs transition"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Table for medium & large screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground">
              <th className="py-3 px-4">Document</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Version</th>
              <th className="py-3 px-4">Uploaded</th>
              <th className="py-3 px-4">Uploader</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {/* Document Name */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5 max-w-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                      {getFileIcon(doc.filename, doc.mimeType)}
                    </div>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onPreview(doc)}
                        className="font-medium text-foreground hover:text-primary transition truncate block max-w-[260px] text-left"
                        title={doc.filename}
                      >
                        {doc.filename}
                      </button>
                      <div className="text-[10px] text-subtle-foreground font-mono truncate max-w-[260px]">
                        {doc.s3Key}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {renderStatusBadge(doc.status)}
                </td>

                {/* Version */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    v{doc.version}
                  </span>
                </td>

                {/* Uploaded */}
                <td className="py-3 px-4 whitespace-nowrap text-muted-foreground text-[11px]">
                  {formatDate(doc.createdAt)}
                </td>

                {/* Uploader */}
                <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                  {doc.user ? (
                    <div className="truncate max-w-[140px]" title={doc.user.email}>
                      <span className="font-medium text-foreground">
                        {doc.user.name || doc.user.email.split("@")[0]}
                      </span>
                    </div>
                  ) : (
                    <span className="text-subtle-foreground">Public / System</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onPreview(doc)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                      title="Preview content"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownload(doc)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary-subtle transition"
                      title="Download file"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(doc)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive-subtle transition"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile view */}
      <div className="md:hidden divide-y divide-border">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                  {getFileIcon(doc.filename, doc.mimeType)}
                </div>
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onPreview(doc)}
                    className="font-medium text-xs text-foreground hover:text-primary truncate block text-left"
                  >
                    {doc.filename}
                  </button>
                  <span className="text-[10px] text-muted-foreground">
                    v{doc.version} • {formatDate(doc.createdAt)}
                  </span>
                </div>
              </div>
              {renderStatusBadge(doc.status)}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
              <span className="text-[11px] text-muted-foreground">
                {doc.user ? doc.user.name || doc.user.email : "Public"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onPreview(doc)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Preview"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDownload(doc)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary-subtle"
                  title="Download"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(doc)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive-subtle"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 bg-muted/20 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <span className="font-semibold text-foreground">
                {pagination.totalCount === 0
                  ? 0
                  : (pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalCount
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {pagination.totalCount}
              </span>{" "}
              documents
            </span>

            <span className="hidden sm:inline">•</span>

            <div className="hidden sm:flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={pagination.limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="rounded-lg border border-input bg-card px-2 py-1 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-2 text-xs font-medium text-foreground">
              Page {pagination.page} of {Math.max(1, pagination.totalPages)}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
