import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { type ReplyPayload, ticketsApi } from "@/services/tickets";

/** Fetch the list of unresolved email tickets (server-filtered). */
export function useTickets() {
  const companyId = useActiveCompanyId();

  return useQuery({
    queryKey: ["tickets", companyId],
    queryFn: () => ticketsApi.list(companyId!),
    enabled: !!companyId,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });
}

/** Fetch the full thread for a single ticket. */
export function useTicket(ticketId: string | null) {
  const companyId = useActiveCompanyId();

  return useQuery({
    queryKey: ["tickets", companyId, ticketId],
    queryFn: () => ticketsApi.getById(companyId!, ticketId!),
    enabled: !!companyId && !!ticketId,
    placeholderData: keepPreviousData,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });
}

/** Mark every message in a ticket as seen. */
export function useMarkTicketSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      ticketId,
    }: {
      companyId: string;
      ticketId: string;
    }) => ticketsApi.markSeen(companyId, ticketId),
    onSuccess: (_, { companyId, ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ["tickets", companyId] });
      queryClient.invalidateQueries({
        queryKey: ["tickets", companyId, ticketId],
      });
    },
  });
}

/** Send a reply on a ticket thread. */
export function useReplyToTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      ticketId,
      payload,
    }: {
      companyId: string;
      ticketId: string;
      payload: ReplyPayload;
    }) => ticketsApi.reply(companyId, ticketId, payload),
    onSuccess: (_, { companyId, ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ["tickets", companyId] });
      queryClient.invalidateQueries({
        queryKey: ["tickets", companyId, ticketId],
      });
    },
  });
}
