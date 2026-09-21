"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DocumentUploadCard } from "@/components/knowledge/DocumentUploadCard";
import { AuthLoading, AuthRequiredCard } from "@/components/auth/AuthRequiredCard";

export default function KnowledgeBasePage() {
  const { isAuthenticated, isHydrated } = useAuth();

 if (!isHydrated) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return (
      <AuthRequiredCard
        title="Authentication Required"
        description="You must be signed in to upload and ingest documents into the knowledge base."
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Knowledge Base Ingestion
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload raw text, markdown, or CSV files to enrich the vector knowledge base.
            </p>
          </div>
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted shadow-xs transition"
          >
            <FileText className="h-4 w-4 text-primary" />
            <span>Browse Uploaded Documents</span>
          </Link>
        </div>

        <DocumentUploadCard />
      </div>
    </div>
  );
}

