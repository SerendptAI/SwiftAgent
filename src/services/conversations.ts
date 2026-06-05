import { apiClient } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "system" | "user" | "agent" | string;
  content: string;
  timestamp?: string;
}

/** Returned by the list endpoint (no messages). */
export interface ChatSession {
  id: string;
  company_id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  seen?: boolean;
  /** True when this chat has been escalated to a ticket. */
  escalated?: boolean;
  /** ID of the ticket this chat was escalated into. */
  ticket_id?: string;
  /** Relative path served by the API (e.g. "/chat-avatars/newimg.svg"). */
  avatar?: string | null;
}

/** Returned by the detail endpoint (includes messages). */
export interface ChatSessionDetail extends ChatSession {
  messages: ChatMessage[];
}

// ── API Service ────────────────────────────────────────────────────────────────

export const chatsApi = {
  /** Get a list of chat sessions (without messages) for a company. */
  list: async (
    companyId: string,
    limit: number = 50,
    skip: number = 0,
  ): Promise<ChatSession[]> => {
    const { data } = await apiClient.get<
      { items: ChatSession[] } | ChatSession[]
    >(`/api/v1/dashboard/${companyId}/chats`, { params: { limit, skip } });
    return Array.isArray(data) ? data : data.items;
  },

  /** Get the full history of a specific chat session. */
  getById: async (
    companyId: string,
    chatId: string,
  ): Promise<ChatSessionDetail> => {
    const { data } = await apiClient.get<ChatSessionDetail>(
      `/api/v1/dashboard/${companyId}/chats/${chatId}`,
    );
    return data;
  },

  /** Mark a chat session as seen. */
  markSeen: async (companyId: string, chatId: string): Promise<void> => {
    await apiClient.patch(
      `/api/v1/dashboard/${companyId}/chats/${chatId}/seen`,
    );
  },
};
