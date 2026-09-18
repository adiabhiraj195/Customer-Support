"use client";

import { DocumentUploadCard } from "@/components/knowledge/DocumentUploadCard";

export default function KnowledgeBasePage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="mx-auto max-w-5xl">
        <DocumentUploadCard />
      </div>
    </div>
  );
}
