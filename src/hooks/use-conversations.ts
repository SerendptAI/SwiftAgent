import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/use-auth";
import { chatsApi } from "@/services/conversations";

/** Fetch the list of chat sessions for the current company. */
export function useChats() {
  const { data: user } = useCurrentUser();
  const companyId = user?.company_id;

  return useQuery({
    queryKey: ["chats", companyId],
    queryFn: () => chatsApi.list(companyId!),
    enabled: !!companyId,
  });
}

/** Fetch the full detail (with messages) for a single chat session. */
export function useChat(chatId: string | null) {
  const { data: user } = useCurrentUser();
  const companyId = user?.company_id;

  return useQuery({
    queryKey: ["chats", companyId, chatId],
    queryFn: () => chatsApi.getById(companyId!, chatId!),
    enabled: !!companyId && !!chatId,
    placeholderData: keepPreviousData,
  });
}
