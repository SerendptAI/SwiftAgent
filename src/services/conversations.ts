import { apiClient } from "@/lib/api-client";
import { unwrapList } from "@/lib/unwrap-list";

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
  /** Latest message snippet shown in the list. */
  preview_message?: string;
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
    return unwrapList(data);
  },

  getById: async (
    companyId: string,
    chatId: string,
  ): Promise<ChatSessionDetail> => {
    const { data } = await apiClient.get<ChatSessionDetail>(
      `/api/v1/dashboard/${companyId}/chats/${chatId}`,
    );
    return data;
  },

  markSeen: async (companyId: string, chatId: string): Promise<void> => {
    await apiClient.patch(
      `/api/v1/dashboard/${companyId}/chats/${chatId}/seen`,
    );
  },
};
