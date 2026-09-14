"use client";

import { formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { Icons } from "@/components/icons";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/use-notifications";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  getNotificationRoute,
  type NotificationItem,
} from "@/services/notifications";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  /** Element id of the trigger button so clicks on it don't auto-close the panel. */
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function NotificationsPanel({
  open,
  onClose,
  triggerRef,
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data, isLoading, isError } = useNotifications(20);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const removeNotification = useDeleteNotification();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef?.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
      className="absolute top-full right-0 z-1050 mt-3 flex max-h-[min(560px,calc(100vh-120px))] w-[340px] flex-col overflow-hidden rounded-[10px] border border-black bg-white"
    >
      <div className="flex flex-col gap-4 overflow-y-auto px-4 pt-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-greed text-[24px] leading-none font-medium text-black">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="text-[11px] font-medium text-black/60 underline-offset-2 transition-colors hover:text-black hover:underline disabled:opacity-40"
            >
              Mark all read
            </button>
          )}
        </div>

        <button
          type="button"
          className="flex h-[48px] w-full shrink-0 items-center justify-center rounded-[16px] border border-black/40 bg-[#F2B035] px-3 text-[13px] font-medium text-black shadow-[-4px_4px_0px_0px_#000000] transition-transform hover:translate-y-[1px] hover:shadow-[-2px_3px_0px_0px_#000000]"
        >
          Need anything? Reach out to us
        </button>

        {isLoading ? (
          <PanelMessage>Loading…</PanelMessage>
        ) : isError ? (
          <PanelMessage>Couldn’t load notifications.</PanelMessage>
        ) : notifications.length === 0 ? (
          <PanelMessage>You’re all caught up.</PanelMessage>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {notifications.map((item) => (
              <li key={item.id}>
                <NotificationRow
                  item={item}
                  onActivate={() => {
                    if (!item.read) markRead.mutate(item.id);
                    const route = getNotificationRoute(item);
                    if (route) {
                      router.push(route);
                      onClose();
                    }
                  }}
                  onDelete={() => removeNotification.mutate(item.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PanelMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="py-6 text-center text-[12px] text-black/40">{children}</p>
  );
}

function formatTimestamp(value: string): string {
  const normalized = /[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true });
}

function NotificationRow({
  item,
  onActivate,
  onDelete,
}: {
  item: NotificationItem;
  onActivate: () => void;
  onDelete: () => void;
}) {
  const Icon = item.read
    ? Icons.NotificationBellRead
    : Icons.NotificationBellUnread;
  const timestamp = formatTimestamp(item.created_at);
  // A row is actionable when it still needs marking read or links somewhere.
  const isActionable = !item.read || getNotificationRoute(item) !== null;

  return (
    <div className="group flex w-full items-center gap-2.5 rounded-[16px] border border-black/5 bg-white px-3 py-2.5">
      <button
        type="button"
        onClick={onActivate}
        disabled={!isActionable}
        className={cn(
          "flex min-w-0 flex-1 items-start gap-2.5 text-left",
          isActionable && "cursor-pointer",
        )}
      >
        <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span
            className={cn(
              "line-clamp-1 text-[12px] leading-tight font-medium text-black",
              item.read && "opacity-40",
            )}
          >
            {item.title}
          </span>
          {item.body && (
            <span
              className={cn(
                "line-clamp-2 text-[11px] leading-tight text-black/70",
                item.read && "opacity-40",
              )}
            >
              {item.body}
            </span>
          )}
          {timestamp && (
            <span className="text-[10px] text-black/30">{timestamp}</span>
          )}
        </span>
      </button>
      <button
        type="button"
        aria-label="Delete notification"
        onClick={onDelete}
        className="flex h-5 w-5 shrink-0 items-center justify-center self-start rounded-full text-black/30 opacity-0 transition group-hover:opacity-100 hover:bg-black/5 hover:text-black"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
