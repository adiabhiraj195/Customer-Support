import { apiFetch } from "./client";
import {
  DeleteDocumentResponse,
  DocumentContentResponse,
  DocumentDetailResponse,
  DocumentFilterParams,
  DocumentListResponse,
  DocumentViewUrlResponse,
} from "@/types/api";

/**
 * List uploaded documents with pagination, status filtering, search, and sorting.
 */
export async function getDocuments(
  params: DocumentFilterParams = {}
): Promise<DocumentListResponse> {
  const query = new URLSearchParams();

  if (params.page !== undefined && params.page !== null) {
    query.set("page", String(params.page));
  }
  if (params.limit !== undefined && params.limit !== null) {
    query.set("limit", String(params.limit));
  }
  if (params.status) {
    query.set("status", params.status);
  }
  if (params.userId) {
    query.set("userId", params.userId);
  }
  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.all !== undefined && params.all !== null) {
    query.set("all", String(params.all));
  }
  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }
  if (params.order) {
    query.set("order", params.order);
  }

  const queryString = query.toString();
  const endpoint = `/documents${queryString ? `?${queryString}` : ""}`;

  return apiFetch<DocumentListResponse>(endpoint, {
    method: "GET",
  });
}

/**
 * Retrieve metadata for a single document by ID.
 */
export async function getDocumentById(id: string): Promise<DocumentDetailResponse> {
  return apiFetch<DocumentDetailResponse>(`/documents/${id}`, {
    method: "GET",
  });
}

/**
 * Fetch raw text content of an uploaded document for inline preview.
 */
export async function getDocumentContent(
  id: string
): Promise<DocumentContentResponse> {
  return apiFetch<DocumentContentResponse>(`/documents/${id}/content`, {
    method: "GET",
  });
}

/**
 * Generate a presigned S3 GET URL for downloading or viewing the file.
 */
export async function getDocumentViewUrl(
  id: string,
  expiresIn: number = 3600
): Promise<DocumentViewUrlResponse> {
  return apiFetch<DocumentViewUrlResponse>(
    `/documents/${id}/view-url?expiresIn=${expiresIn}`,
    {
      method: "GET",
    }
  );
}

/**
 * Delete a document from PostgreSQL and remove its underlying file from S3 storage.
 */
export async function deleteDocument(
  id: string
): Promise<DeleteDocumentResponse> {
  return apiFetch<DeleteDocumentResponse>(`/documents/${id}`, {
    method: "DELETE",
  });
}

