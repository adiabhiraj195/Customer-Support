"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  deleteConversation,
  getConversationById,
  getConversations,
  sendMessage,
} from "@/lib/api/conversations.api";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import {
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
} from "@/types/api";

export function useConversations() {
  const { isAuthenticated, token } = useAuthStore();
  const { setSelectedConversationId, selectedConversationId } = useUIStore();
  const queryClient = useQueryClient();

  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await getConversations();
      return res.data.conversations;
    },
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 30, // 30s
  });

  const createMutation = useMutation({
    mutationFn: (body?: CreateConversationRequest) => createConversation(body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setSelectedConversationId(res.data.conversation.id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (selectedConversationId === id) {
        setSelectedConversationId(null);
      }
    },
  });

  return {
    conversations: conversationsQuery.data || [],
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    error: conversationsQuery.error,
    refetch: conversationsQuery.refetch,
    createConversation: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteConversation: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useConversation(conversationId: string | null) {
  const { isAuthenticated, token } = useAuthStore();
  const queryClient = useQueryClient();

  const conversationQuery = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const res = await getConversationById(conversationId);
      return res.data.conversation;
    },
    enabled: !!token && isAuthenticated && !!conversationId,
    staleTime: 1000 * 10, // 10s
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (req: SendMessageRequest): Promise<SendMessageResponse> => {
      if (!conversationId) throw new Error("No active conversation selected");
      return await sendMessage(conversationId, req);
    },
    onSuccess: () => {
      // Invalidate both the conversation thread and the conversation list (to update counts/updatedAt)
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return {
    conversation: conversationQuery.data,
    isLoading: conversationQuery.isLoading,
    isError: conversationQuery.isError,
    error: conversationQuery.error,
    refetch: conversationQuery.refetch,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.error,
  };
}

