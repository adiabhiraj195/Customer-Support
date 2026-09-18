"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveSupportAgent,
  listSupportAgents,
  rejectSupportAgent,
} from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/authStore";

export function useSupportAgents(status?: string) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "Admin";

  return useQuery({
    queryKey: ["support-agents", status || "all"],
    queryFn: async () => {
      const res = await listSupportAgents(status === "all" ? undefined : status);
      return res.data?.agents || [];
    },
    enabled: !!isAdmin,
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  });
}

export function useApproveAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveSupportAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-agents"] });
    },
  });
}

export function useRejectAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectSupportAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-agents"] });
    },
  });
}

