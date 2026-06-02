import { apiClient } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

/** Known notification `type` values. The backend may add more over time. */
export type NotificationType =
  | "ticket_open"
  | "ticket_reply"
  | "ticket_close"
  | "plan_upgrade"
  | "system_notification"
  | "otp_challenge"
  | "test_otp_notification"
  | (string & {});

/** Arbitrary payload attached to a notification — carries deep-link IDs. */
export interface NotificationData {
  /** Legacy field — some payloads echo the notification type inside `data`. */
  type?: NotificationType;
  ticket_id?: string;
  challenge_id?: string;
  login_url?: string;
  screenshot_url?: string;
  [key: string]: unknown;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: NotificationType;
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

// ── Deep-linking ─────────────────────────────────────────────────────────────

/**
 * Resolve the in-app route a notification should open on click, or `null` when
 * it's purely informational (e.g. a system blast) or its target has no UI yet.
 */
export function getNotificationRoute(item: NotificationItem): string | null {
  const ticketId = item.data?.ticket_id;
  switch (item.type) {
    case "ticket_open":
    case "ticket_reply":
    case "ticket_close":
      return ticketId
        ? `/dashboard/ticketing?tab=tickets&ticket=${encodeURIComponent(ticketId)}`
        : "/dashboard/ticketing?tab=tickets";
    case "plan_upgrade":
      return "/dashboard/billing";
    default:
      // `system_notification`, `otp_challenge`, and unknown types have no
      // dedicated dashboard route — leave them as informational entries.
      return null;
  }
}
