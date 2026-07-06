"use client";

import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import { useState } from "react";

import { MessagesEmptyState } from "@/components/dashboard/ticketing/messages-empty-state";
import { Loader } from "@/components/loader";
import { useChat, useResolvedChats } from "@/hooks/use-conversations";
import { useTicket, useTickets } from "@/hooks/use-tickets";
import { resolveAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

export type TicketKind = "ticket" | "chat";

interface TicketListProps {
  selectedItemId: string;
  onSelectItem: (id: string, kind: TicketKind) => void;
  searchQuery?: string;
}

function TicketListEmptyState() {
  return (
    <MessagesEmptyState className="flex h-full w-full items-center justify-center">
      NOTHING HERE FOR
      <br />
      NOW
    </MessagesEmptyState>
  );
}

function formatRelativeTime(iso?: string): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const timeStr = format(date, "h:mma").toLowerCase();
    if (isToday(date)) return timeStr;
    if (isYesterday(date)) return `Yesterday ${timeStr}`;
    const daysAgo = differenceInCalendarDays(new Date(), date);
    if (daysAgo < 7) return `${daysAgo} days ago ${timeStr}`;
    return `${format(date, "MMM d")} ${timeStr}`;
  } catch {
    return "";
  }
}

export function TicketList({
  selectedItemId,
  onSelectItem,
  searchQuery,
}: TicketListProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const { data: tickets, isLoading: ticketsLoading } = useTickets();
  const { data: resolvedChats, isLoading: chatsLoading } = useResolvedChats();

  // Loading state for the currently-selected item (shared via React Query cache
  // with TicketView / ChatView — no extra network requests). A ticket can now be
  // selected from either tab (read tickets live under Resolved), so key the fetch
  // off which list the id belongs to rather than the active tab.
  const selectedIsTicket =
    !!selectedItemId &&
    (tickets?.some((t) => t.id === selectedItemId) ?? false);
  const selectedIsChat =
    !!selectedItemId &&
    (resolvedChats?.some((c) => c.id === selectedItemId) ?? false);

  const { isFetching: isSelectedTicketFetching } = useTicket(
    selectedIsTicket ? selectedItemId : null,
  );
  const { isFetching: isSelectedChatFetching } = useChat(
    selectedIsChat ? selectedItemId : null,
  );

  const normalizedQuery = searchQuery?.trim().toLowerCase() ?? "";
  const matchesQuery = (...fields: Array<string | null | undefined>) =>
    !normalizedQuery ||
    fields.some((f) => f?.toLowerCase().includes(normalizedQuery));

  const filteredTickets = tickets?.filter((t) =>
    matchesQuery(t.customer_name, t.customer_email, t.subject, t.chat_summary),
  );
  const filteredChats = resolvedChats?.filter((c) =>
    matchesQuery(c.session_id),
  );

  type TicketItem = NonNullable<typeof tickets>[number];
  type ChatItem = NonNullable<typeof resolvedChats>[number];

  const unreadCount =
    filteredTickets?.filter((t) => (t.unseen_count ?? 0) > 0).length ?? 0;
  const isLoading = activeTab === "pending" ? ticketsLoading : chatsLoading;

  const isSelectionLoading = isSelectedTicketFetching || isSelectedChatFetching;

  const renderTicketButton = (ticket: TicketItem) => {
    const unread = (ticket.unseen_count ?? 0) > 0;
    const avatarSrc = resolveAvatarUrl(ticket.avatar);
    const title =
      ticket.customer_name?.trim() || ticket.customer_email || "Unknown sender";
    const subtitle =
      ticket.preview_message?.trim() ||
      ticket.subject?.trim() ||
      ticket.chat_summary ||
      "(no subject)";
    return (
      <button
        key={ticket.id}
        onClick={() => onSelectItem(ticket.id, "ticket")}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-2xl p-0 text-left transition-colors lg:p-3",
          selectedItemId === ticket.id
            ? "text-[#006BE5] lg:bg-blue-50"
            : "hover:text-gray-900 lg:hover:bg-gray-50",
        )}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarSrc} alt="Ticket avatar" width={36} height={31} />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "font-dm-mono truncate text-sm",
                unread
                  ? "font-black text-gray-900"
                  : "font-semibold text-gray-600",
              )}
            >
              {title}
            </span>
            {unread && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#006BE5]"></span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <span
              className={cn(
                "font-stolzl min-w-0 truncate text-xs",
                unread ? "font-bold text-gray-600" : "text-gray-400",
              )}
            >
              {subtitle}
            </span>
            <span className="font-stolzl shrink-0 text-xs text-[#2196F3]">
              {formatRelativeTime(ticket.updated_at)}
            </span>
          </div>
        </div>
      </button>
    );
  };

  const renderChatButton = (chat: ChatItem) => {
    const avatarSrc = resolveAvatarUrl(chat.avatar);
    const sessionLabel = chat.session_id
      ? chat.session_id.slice(0, 13).toUpperCase()
      : "UNKNOWN";
    return (
      <button
        key={chat.id}
        onClick={() => onSelectItem(chat.id, "chat")}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-2xl p-0 text-left transition-colors lg:p-3",
          selectedItemId === chat.id
            ? "text-[#6433CC] lg:bg-[#ECECEC]"
            : "hover:text-gray-900 lg:hover:bg-[#ECECEC]",
        )}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarSrc} alt="Chat avatar" width={36} height={31} />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-dm-mono truncate text-sm font-semibold text-gray-600">
              {sessionLabel}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <span className="font-stolzl min-w-0 truncate text-xs text-gray-400">
              {chat.preview_message?.trim() ||
                `${chat.message_count} ${chat.message_count === 1 ? "message" : "messages"}`}
            </span>
            <span className="font-stolzl shrink-0 text-xs text-[#6433CC]">
              {formatRelativeTime(chat.updated_at)}
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col lg:h-full lg:min-h-0 lg:rounded-3xl lg:bg-white lg:p-4 lg:shadow-sm",
        isSelectionLoading && "travel-border-loading",
      )}
    >
      {/* Pending / Resolved Tabs */}
      <div className="mb-4 flex items-center gap-2 rounded-full p-1 sm:gap-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={cn(
            "relative flex min-h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors sm:min-h-11 sm:flex-none sm:gap-2 sm:rounded-md sm:px-5 sm:py-2.5 sm:text-sm",
            activeTab === "pending"
              ? "bg-[#2196F3] text-white"
              : "bg-[#F6F6F6] text-gray-500 hover:text-gray-700",
          )}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 shrink-0 sm:h-6 sm:w-6"
          >
            <path
              d="M17.2013 2H6.79864C5.34088 2 4.0619 2.9847 4.00348 4.40355C3.92997 6.18879 5.18552 7.37422 6.50423 8.4871C8.32849 10.0266 9.24063 10.7964 9.3363 11.7708C9.35127 11.9233 9.35127 12.0767 9.3363 12.2292C9.24063 13.2036 8.3285 13.9734 6.50423 15.5129C5.1492 16.6564 3.92618 17.7195 4.00348 19.5964C4.0619 21.0153 5.34088 22 6.79864 22H17.2013C18.659 22 19.938 21.0153 19.9964 19.5964C20.0429 18.4668 19.6243 17.342 18.7351 16.56C18.3297 16.2034 17.9088 15.8615 17.4957 15.5129C15.6714 13.9734 14.7593 13.2036 14.6636 12.2292C14.6486 12.0767 14.6486 11.9233 14.6636 11.7708C14.7593 10.7964 15.6714 10.0266 17.4957 8.4871C18.8365 7.35558 20.0728 6.25809 19.9964 4.40355C19.938 2.9847 18.659 2 17.2013 2Z"
              stroke={activeTab === "pending" ? "white" : "black"}
              strokeWidth="1.5"
            />
            <path
              d="M9 21.6381C9 21.1962 9 20.9752 9.0876 20.7821C9.10151 20.7514 9.11699 20.7214 9.13399 20.6923C9.24101 20.509 9.42211 20.3796 9.78432 20.1208C10.7905 19.4021 11.2935 19.0427 11.8652 19.0045C11.955 18.9985 12.045 18.9985 12.1348 19.0045C12.7065 19.0427 13.2095 19.4021 14.2157 20.1208C14.5779 20.3796 14.759 20.509 14.866 20.6923C14.883 20.7214 14.8985 20.7514 14.9124 20.7821C15 20.9752 15 21.1962 15 21.6381V22H9V21.6381Z"
              stroke={activeTab === "pending" ? "white" : "black"}
              strokeWidth="1.5"
            />
          </svg>
          <span>Pending</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white sm:h-5 sm:w-5 sm:text-[10px]">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("resolved")}
          className={cn(
            "flex min-h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors sm:min-h-11 sm:flex-none sm:gap-2 sm:rounded-md sm:px-5 sm:py-2.5 sm:text-sm",
            activeTab === "resolved"
              ? "bg-[#2196F3] text-white"
              : "bg-[#F6F6F6] text-gray-500 hover:text-gray-700",
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="size-4 shrink-0 sm:size-5"
          >
            <rect
              x="1"
              y="1"
              width="14"
              height="14"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4.5 8L7 10.5L11.5 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Resolved</span>
        </button>
      </div>

      {/* Items */}
      <div className="scrollbar-none flex-1 space-y-1 overflow-y-auto pt-3 lg:pt-0">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader />
          </div>
        ) : activeTab === "pending" ? (
          !filteredTickets || filteredTickets.length === 0 ? (
            <TicketListEmptyState />
          ) : (
            filteredTickets.map(renderTicketButton)
          )
        ) : !filteredChats || filteredChats.length === 0 ? (
          <TicketListEmptyState />
        ) : (
          filteredChats.map(renderChatButton)
        )}
      </div>
    </div>
  );
}
