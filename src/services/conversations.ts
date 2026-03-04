import { apiClient } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ConversationMessage {
  role: "system" | "user" | "agent" | string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  messages: ConversationMessage[];
  created_at: string;
  updated_at: string;
}

export interface CreateConversationPayload {
  messages: Omit<ConversationMessage, "timestamp">[];
}

// ── API Service ────────────────────────────────────────────────────────────────

export const conversationsApi = {
  list: async (): Promise<Conversation[]> => {
    const { data } = await apiClient.get<Conversation[]>(
      "/api/v1/conversations/",
    );
    return data;
  },

  get: async (conversationId: string): Promise<Conversation> => {
    const { data } = await apiClient.get<Conversation>(
      `/api/v1/conversations/${conversationId}`,
    );
    return data;
  },

  create: async (payload: CreateConversationPayload): Promise<Conversation> => {
    const { data } = await apiClient.post<Conversation>(
      `/api/v1/conversations/`,
      payload,
    );
    return data;
  },
};
