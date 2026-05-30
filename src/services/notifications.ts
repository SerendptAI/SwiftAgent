import { apiClient } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

/** Known `data.type` values carried on a notification payload. */
export type NotificationType =
  | "otp_challenge"
  | "test_otp_notification"
  | (string & {});

/** Arbitrary payload attached to a notification. */
export interface NotificationData {
  type?: NotificationType;
  challenge_id?: string;
  login_url?: string;
  screenshot_url?: string;
  [key: string]: unknown;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  body: string;
  data: NotificationData | null;
  read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  total: number;
  unread_count: number;
}

// ── API Service ────────────────────────────────────────────────────────────────

export const notificationsApi = {
  /** Paginated notification history for the authenticated user (newest first). */
  list: async (
    limit: number = 50,
    skip: number = 0,
  ): Promise<NotificationsResponse> => {
    const { data } = await apiClient.get<NotificationsResponse>(
      `/api/v1/notifications`,
      { params: { limit, skip } },
    );
    return data;
  },

  /** Mark a single notification as read. */
  markRead: async (notificationId: string): Promise<void> => {
    await apiClient.put(`/api/v1/notifications/${notificationId}/read`);
  },

  /** Mark every unread notification as read. Returns the number updated. */
  markAllRead: async (): Promise<number> => {
    const { data } = await apiClient.post<{
      status: string;
      updated_count: number;
    }>(`/api/v1/notifications/read-all`);
    return data.updated_count;
  },

  /** Permanently delete a notification from history. */
  remove: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/notifications/${notificationId}`);
  },
};
