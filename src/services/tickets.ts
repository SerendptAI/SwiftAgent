import { apiClient } from "@/lib/api-client";

import type { ChatMessage } from "./conversations";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TicketStatus = "pending" | "resolved" | string;

/** Ticket as returned by the detail endpoint. */
export interface Ticket {
  id: string;
  company_id: string;
  customer_email: string;
  customer_name: string;
  subject: string;
  status: TicketStatus;
  messages: ChatMessage[];
  unseen_count: number;
  chat_session_id: string;
  chat_summary: string;
  created_at: string;
  updated_at: string;
}

/** The list endpoint may return the same shape or a lighter summary. */
export type TicketListItem = Omit<Ticket, "messages"> & {
  messages?: ChatMessage[];
};

export interface ReplyPayload {
  body_text: string;
  body_html?: string;
}

// ── API Service ────────────────────────────────────────────────────────────────

export const ticketsApi = {
  list: async (
    companyId: string,
    limit: number = 50,
    skip: number = 0,
  ): Promise<TicketListItem[]> => {
    const { data } = await apiClient.get<
      { items: TicketListItem[] } | TicketListItem[]
    >(`/api/v1/email/${companyId}/tickets`, { params: { limit, skip } });
    return Array.isArray(data) ? data : data.items;
  },

  getById: async (companyId: string, ticketId: string): Promise<Ticket> => {
    const { data } = await apiClient.get<Ticket>(
      `/api/v1/email/${companyId}/tickets/${ticketId}`,
    );
    return data;
  },

  reply: async (
    companyId: string,
    ticketId: string,
    payload: ReplyPayload,
  ): Promise<void> => {
    await apiClient.post(
      `/api/v1/email/${companyId}/tickets/${ticketId}/reply`,
      payload,
    );
  },

  markSeen: async (companyId: string, ticketId: string): Promise<void> => {
    await apiClient.patch(
      `/api/v1/email/${companyId}/tickets/${ticketId}/seen`,
    );
  },
};
