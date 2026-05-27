import { apiClient } from "@/lib/api-client";

import type { ChatSessionDetail } from "./conversations";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TicketStatus = "pending" | "resolved" | string;

/** Email-style message as returned in a ticket's `messages` array. */
export interface EmailMessage {
  direction: "inbound" | "outbound" | "system" | string;
  body_text: string | null;
  body_html?: string | null;
  sender_email?: string | null;
  message_id?: string | null;
  timestamp?: string;
  seen?: boolean;
}

/** Ticket as returned by the detail endpoint. */
export interface Ticket {
  id: string;
  company_id: string;
  customer_email: string;
  customer_name: string;
  subject: string;
  status: TicketStatus;
  messages: EmailMessage[];
  unseen_count: number;
  chat_session_id: string | null;
  chat_summary: string;
  created_at: string;
  updated_at: string;
  /** Originating chat conversation, when the ticket was escalated from a chat. */
  attributed_chat?: ChatSessionDetail;
  /** Relative path served by the API (e.g. "/chat-avatars/newimg.svg"). */
  avatar?: string | null;
}

/** The list endpoint may return the same shape or a lighter summary. */
export type TicketListItem = Omit<Ticket, "messages"> & {
  messages?: EmailMessage[];
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
