"use client";

import { useEffect, useRef } from "react";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

type NotificationKind = "announcement" | "ticket";

interface NotificationItem {
  id: string;
  text: string;
  kind: NotificationKind;
  unread: boolean;
}

const ANNOUNCEMENTS: NotificationItem[] = [
  {
    id: "a1",
    text: "WE NOW HAVE A NEW MOBILE APP COMING SOON",
    kind: "announcement",
    unread: true,
  },
];

const TICKETS: NotificationItem[] = [
  {
    id: "t1",
    text: "REQUEST FROM DAVID JOHNSON SUCCESSFULLY RESOLVED",
    kind: "ticket",
    unread: true,
  },
  {
    id: "t2",
    text: "REQUEST FROM MARIA GONZALES SUCCESSFULLY RESOLVED",
    kind: "ticket",
    unread: false,
  },
  {
    id: "t3",
    text: "REQUEST FROM MARIA GONZALES SUCCESSFULLY RESOLVED",
    kind: "ticket",
    unread: false,
  },
  {
    id: "t4",
    text: "REQUEST FROM MARIA GONZALES SUCCESSFULLY RESOLVED",
    kind: "ticket",
    unread: false,
  },
];

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
        <h2 className="font-greed-narrow text-[24px] leading-none font-medium text-black">
          Notifications
        </h2>

        <button
          type="button"
          className="font-dm-mono flex h-[48px] w-full shrink-0 items-center justify-center rounded-[16px] border border-black/40 bg-[#F2B035] px-3 text-[13px] font-medium text-black uppercase shadow-[-3px_4px_0px_0px_#000000] transition-transform hover:translate-y-[1px] hover:shadow-[-2px_3px_0px_0px_#000000]"
        >
          Need anything? Reach out to us
        </button>

        <NotificationSection title="Announcements" items={ANNOUNCEMENTS} />
        <NotificationSection title="Tickets" items={TICKETS} />
      </div>
    </div>
  );
}

function NotificationSection({
  title,
  items,
}: {
  title: string;
  items: NotificationItem[];
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-dm-mono text-[15px] leading-[1.34] font-medium tracking-[-0.01em] text-black/80 uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <NotificationRow item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function NotificationRow({ item }: { item: NotificationItem }) {
  const Icon = item.unread
    ? Icons.NotificationBellUnread
    : Icons.NotificationBellRead;
  return (
    <div className="flex h-[56px] w-full items-center gap-2.5 rounded-[16px] border border-black/5 bg-white px-3">
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <p
        className={cn(
          "font-dm-mono line-clamp-2 text-[12px] leading-tight text-black uppercase",
          !item.unread && "opacity-40",
        )}
      >
        {item.text}
      </p>
    </div>
  );
}
