"use client";

import { useMutation } from "@tanstack/react-query";
import { statelessChat } from "@/lib/api/rag.api";
import { StatelessChatRequest, StatelessChatResponse } from "@/types/api";

export function useStatelessChat() {
  const mutation = useMutation<StatelessChatResponse, Error, StatelessChatRequest>({
    mutationFn: (req) => statelessChat(req),
  });

  return {
    ask: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

