import { apiClient } from "@/lib/api-client";
import { unwrapList } from "@/lib/unwrap-list";

import type { ChatSessionDetail } from "./conversations";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TicketStatus = "pending" | "resolved" | string;

/** Metadata for a file attached to a ticket message. */
export interface AttachmentMeta {
  filename: string;
  content_type?: string | null;
  /** Size in bytes. */
  size?: number | null;
  /**
   * Persistent URL to the stored file, when the backend serves it. When
   * present, the attachment is viewable across reloads and devices. Absent for
   * legacy/streamed attachments that were never stored.
   */
  url?: string | null;
}

/** Email-style message as returned in a ticket's `messages` array. */
export interface EmailMessage {
  direction: "inbound" | "outbound" | "system" | string;
  body_text: string | null;
  body_html?: string | null;
  sender_email?: string | null;
  message_id?: string | null;
  timestamp?: string;
  seen?: boolean;
  /** Metadata for files sent with this message (display-only — not downloadable). */
  attachments?: AttachmentMeta[];
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
  /** Latest message snippet shown in the list. */
  preview_message?: string;
};

export interface ReplyPayload {
  body_text: string;
  body_html?: string;
  replier_name?: string;
  replier_picture?: string | null;
  /** Files to attach to the reply email. Up to 5 files, max 10MB each. */
  attachments?: File[];
}

/** Max number of attachments accepted per reply. */
export const MAX_REPLY_ATTACHMENTS = 5;
/** Max size (bytes) per attachment. */
export const MAX_REPLY_ATTACHMENT_BYTES = 10 * 1024 * 1024;

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
    return unwrapList(data);
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
    const url = `/api/v1/email/${companyId}/tickets/${ticketId}/reply`;
    const { attachments, ...fields } = payload;

    // No files → keep the original JSON request (backward compatible).
    if (!attachments || attachments.length === 0) {
      await apiClient.post(url, fields);
      return;
    }

    // Files present → switch to multipart/form-data.
    const formData = new FormData();
    formData.append("body_text", fields.body_text);
    if (fields.body_html) formData.append("body_html", fields.body_html);
    if (fields.replier_name)
      formData.append("replier_name", fields.replier_name);
    if (fields.replier_picture)
      formData.append("replier_picture", fields.replier_picture);
    attachments.forEach((file) => formData.append("attachments", file));

    await apiClient.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60_000,
    });
  },

  markSeen: async (companyId: string, ticketId: string): Promise<void> => {
    await apiClient.patch(
      `/api/v1/email/${companyId}/tickets/${ticketId}/seen`,
    );
  },

  resolve: async (companyId: string, ticketId: string): Promise<void> => {
    await apiClient.patch(
      `/api/v1/email/${companyId}/tickets/${ticketId}/resolve`,
    );
  },
};
