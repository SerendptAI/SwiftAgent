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
    const { data } = await apiClient.get<ChatSession[]>(
      `/api/v1/dashboard/${companyId}/chats`,
      { params: { limit, skip } },
    );
    return data;
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
