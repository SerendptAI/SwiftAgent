import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { chatsApi } from "@/services/conversations";

/** Fetch the list of chat sessions for the current company. */
export function useChats() {
  const companyId = useActiveCompanyId();

  return useQuery({
    queryKey: ["chats", companyId],
    queryFn: () => chatsApi.list(companyId!),
    enabled: !!companyId,
  });
}

/**
 * Chat sessions that are still standalone (not escalated to a ticket).
 * Escalated chats are surfaced via the Tickets list instead.
 */
export function useResolvedChats() {
  const query = useChats();
  const data = useMemo(
    () => query.data?.filter((c) => !c.escalated),
    [query.data],
  );
  return { ...query, data };
}

/** Fetch the full detail (with messages) for a single chat session. */
export function useChat(chatId: string | null) {
  const companyId = useActiveCompanyId();

  return useQuery({
    queryKey: ["chats", companyId, chatId],
    queryFn: () => chatsApi.getById(companyId!, chatId!),
    enabled: !!companyId && !!chatId,
    placeholderData: keepPreviousData,
  });
}

/** Fetch all chat details (with messages) for search. */
export function useAllChatDetails() {
  const companyId = useActiveCompanyId();
  const { data: chats } = useChats();

  return useQueries({
    queries: (chats ?? []).map((chat) => ({
      queryKey: ["chats", companyId, chat.id],
      queryFn: () => chatsApi.getById(companyId!, chat.id),
      enabled: !!companyId && !!chat.id,
      staleTime: 5 * 60 * 1000,
    })),
  });
}

/** Mark a chat as seen and invalidate caches. */
export function useMarkChatSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      chatId,
    }: {
      companyId: string;
      chatId: string;
    }) => chatsApi.markSeen(companyId, chatId),
    onSuccess: (_, { companyId, chatId }) => {
      // Invalidate the main list so it moves from Pending -> Resolved
      queryClient.invalidateQueries({ queryKey: ["chats", companyId] });
      // Also invalidate the specific chat if it was open
      queryClient.invalidateQueries({ queryKey: ["chats", companyId, chatId] });
    },
  });
}
