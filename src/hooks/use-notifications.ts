import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api-client";
import {
  notificationsApi,
  type NotificationsResponse,
} from "@/services/notifications";

const NOTIFICATIONS_KEY = ["notifications"] as const;

export function useNotifications(limit: number = 20) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, limit],
    queryFn: () => notificationsApi.list(limit),
    enabled: !!getAccessToken(),
    // Keep the bell badge reasonably fresh while the dashboard is open.
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/** Mark a single notification as read, optimistically updating the cache. */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const snapshots = queryClient.getQueriesData<NotificationsResponse>({
        queryKey: NOTIFICATIONS_KEY,
      });
      for (const [key, prev] of snapshots) {
        if (!prev) continue;
        const wasUnread = prev.notifications.some(
          (n) => n.id === notificationId && !n.read,
        );
        queryClient.setQueryData<NotificationsResponse>(key, {
          ...prev,
          unread_count: wasUnread
            ? Math.max(0, prev.unread_count - 1)
            : prev.unread_count,
          notifications: prev.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n,
          ),
        });
      }
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      context?.snapshots.forEach(([key, prev]) =>
        queryClient.setQueryData(key, prev),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const snapshots = queryClient.getQueriesData<NotificationsResponse>({
        queryKey: NOTIFICATIONS_KEY,
      });
      for (const [key, prev] of snapshots) {
        if (!prev) continue;
        queryClient.setQueryData<NotificationsResponse>(key, {
          ...prev,
          unread_count: 0,
          notifications: prev.notifications.map((n) => ({ ...n, read: true })),
        });
      }
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(([key, prev]) =>
        queryClient.setQueryData(key, prev),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.remove(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const snapshots = queryClient.getQueriesData<NotificationsResponse>({
        queryKey: NOTIFICATIONS_KEY,
      });
      for (const [key, prev] of snapshots) {
        if (!prev) continue;
        const removed = prev.notifications.find((n) => n.id === notificationId);
        queryClient.setQueryData<NotificationsResponse>(key, {
          ...prev,
          total: Math.max(0, prev.total - (removed ? 1 : 0)),
          unread_count:
            removed && !removed.read
              ? Math.max(0, prev.unread_count - 1)
              : prev.unread_count,
          notifications: prev.notifications.filter(
            (n) => n.id !== notificationId,
          ),
        });
      }
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      context?.snapshots.forEach(([key, prev]) =>
        queryClient.setQueryData(key, prev),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}
