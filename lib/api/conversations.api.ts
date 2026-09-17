import { apiFetch } from "./client";
import {
  ConversationDetailResponse,
  ConversationsListResponse,
  CreateConversationRequest,
  CreateConversationResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "@/types/api";

export async function getConversations(): Promise<ConversationsListResponse> {
  return apiFetch<ConversationsListResponse>("/conversations", {
    method: "GET",
    requiresAuth: true,
  });
}

export async function getConversationById(
  id: string
): Promise<ConversationDetailResponse> {
  return apiFetch<ConversationDetailResponse>(`/conversations/${id}`, {
    method: "GET",
    requiresAuth: true,
  });
}

export async function createConversation(
  body: CreateConversationRequest = {}
): Promise<CreateConversationResponse> {
  return apiFetch<CreateConversationResponse>("/conversations", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(body),
  });
}

export async function sendMessage(
  conversationId: string,
  body: SendMessageRequest
): Promise<SendMessageResponse> {
  return apiFetch<SendMessageResponse>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(body),
  });
}

export async function deleteConversation(
  id: string
): Promise<{ success: boolean; message?: string }> {
  return apiFetch<{ success: boolean; message?: string }>(`/conversations/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  });
}

