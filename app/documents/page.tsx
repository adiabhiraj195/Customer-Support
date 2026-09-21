"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Info,
  LogIn,
  UploadCloud,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentFilterParams, DocumentItem } from "@/types/api";
import { DocumentStatsCards } from "@/components/documents/DocumentStatsCards";
import { DocumentFilters } from "@/components/documents/DocumentFilters";
import { DocumentListTable } from "@/components/documents/DocumentListTable";
import { DocumentPreviewModal } from "@/components/documents/DocumentPreviewModal";
import { DocumentDeleteModal } from "@/components/documents/DocumentDeleteModal";

export default function DocumentsPage() {
  const { isAuthenticated, isHydrated } = useAuth();

  const [filters, setFilters] = useState<DocumentFilterParams>({
    page: 1,
    limit: 10,
    status: "",
    search: "",
    all: false,
    sortBy: "createdAt",
    order: "desc",
  });

  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<DocumentItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    documents,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    deleteDocument,
    isDeleting,
    triggerDownload,
  } = useDocuments(filters);

  const handleFilterChange = (newFilters: Partial<DocumentFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: "",
      search: "",
      all: false,
      sortBy: "createdAt",
      order: "desc",
    });
  };

  const handleDownload = async (doc: DocumentItem) => {
    setActionError(null);
    try {
      await triggerDownload(doc);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to download document"
      );
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await deleteDocument(id);
      setActionSuccess(`Document deleted successfully.`);
      setDeleteDoc(null);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete document"
      );
    }
  };

  const hasFiltersApplied = Boolean(
    filters.search || filters.status || filters.all
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-2">
              <FileText className="h-3.5 w-3.5" />
              <span>RAG Knowledge Base</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Document Library
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Browse, preview content, download, and manage uploaded data files in your knowledge base.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/knowledgebase"
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2.5 text-xs font-medium shadow-xs transition"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload New File</span>
            </Link>
          </div>
        </div>

        {/* Unauthenticated info banner if guest */}
        {isHydrated && !isAuthenticated && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary-border bg-primary-subtle/40 p-4 text-xs text-primary-subtle-foreground">
            <div className="flex items-center gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-primary" />
              <span>
                You are currently browsing public documents. Sign in to upload and manage documents scoped to your account.
              </span>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline shrink-0"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          </div>
        )}

        {/* Action feedback banners */}
        {actionSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-success-subtle p-3 text-xs text-success-subtle-foreground border border-success-border">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {(actionError || isError) && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive-subtle p-3 text-xs text-destructive-subtle-foreground border border-destructive-border">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{actionError || (error as Error)?.message}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <DocumentStatsCards
          documents={documents}
          totalCount={pagination?.totalCount}
        />

        {/* Search, Status, Scope Filters */}
        <DocumentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onRefresh={refetch}
          isRefreshing={isFetching}
          isAuthenticated={isAuthenticated}
        />

        {/* Documents Table */}
        <DocumentListTable
          documents={documents}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={(page) => handleFilterChange({ page })}
          onLimitChange={(limit) => handleFilterChange({ limit, page: 1 })}
          onPreview={(doc) => setPreviewDoc(doc)}
          onDownload={handleDownload}
          onDelete={(doc) => setDeleteDoc(doc)}
          hasFiltersApplied={hasFiltersApplied}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Preview Content Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={handleDownload}
      />

      {/* Delete Confirmation Modal */}
      <DocumentDeleteModal
        document={deleteDoc}
        onClose={() => setDeleteDoc(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
