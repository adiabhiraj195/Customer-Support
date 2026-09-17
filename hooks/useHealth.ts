"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/lib/api/health.api";
import { HealthResponse } from "@/types/api";

export function useHealth() {
  const query = useQuery<HealthResponse, Error>({
    queryKey: ["health"],
    queryFn: () => getHealth(),
    refetchInterval: 30000, // 30 seconds
    retry: 1,
    staleTime: 10000,
  });

  return {
    isHealthy: query.isSuccess && query.data?.status === "ok",
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

