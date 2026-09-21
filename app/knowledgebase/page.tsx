"use client";

import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
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
      <div className="mx-auto max-w-5xl">
        <DocumentUploadCard />
      </div>
    </div>
  );
}
