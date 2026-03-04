import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  conversationsApi,
  CreateConversationPayload,
} from "@/services/conversations";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: conversationsApi.list,
  });
}

export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => conversationsApi.get(conversationId!),
    enabled: !!conversationId,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConversationPayload) =>
      conversationsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
