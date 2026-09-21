"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDocument,
  getDocumentById,
  getDocumentContent,
  getDocumentViewUrl,
  getDocuments,
} from "@/lib/api/documents.api";
import { DocumentFilterParams, DocumentItem } from "@/types/api";

export function useDocuments(params: DocumentFilterParams = {}) {
  const queryClient = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: ["documents", params],
    queryFn: async () => {
      const res = await getDocuments(params);
      return res.data;
    },
    staleTime: 1000 * 15, // 15 seconds
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const triggerDownload = async (doc: Pick<DocumentItem, "id" | "filename">) => {
    const res = await getDocumentViewUrl(doc.id);
    const downloadUrl = res.data.downloadUrl;
    if (!downloadUrl) {
      throw new Error("No download URL returned from server.");
    }

    // Open or download in browser
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = doc.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    documents: documentsQuery.data?.documents ?? [],
    pagination: documentsQuery.data?.pagination,
    isLoading: documentsQuery.isLoading,
    isFetching: documentsQuery.isFetching,
    isError: documentsQuery.isError,
    error: documentsQuery.error,
    refetch: documentsQuery.refetch,
    deleteDocument: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    triggerDownload,
  };
}

export function useDocumentContent(documentId: string | null) {
  return useQuery({
    queryKey: ["documentContent", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const res = await getDocumentContent(documentId);
      return res.data;
    },
    enabled: !!documentId,
    staleTime: 1000 * 60, // 1 min
  });
}

export function useDocumentDetail(documentId: string | null) {
  return useQuery({
    queryKey: ["documentDetail", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const res = await getDocumentById(documentId);
      return res.data.document;
    },
    enabled: !!documentId,
    staleTime: 1000 * 30,
  });
}

