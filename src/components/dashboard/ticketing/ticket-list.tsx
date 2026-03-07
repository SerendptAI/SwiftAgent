"use client";

import { format } from "date-fns";
import { useState } from "react";

import { Loader } from "@/components/loader";
import { useChats } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

interface TicketListProps {
  selectedTicketId: string;
  onSelectTicket: (id: string) => void;
}

export function TicketList({
  selectedTicketId,
  onSelectTicket,
}: TicketListProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const { data: chats, isLoading } = useChats();

  const chatCount = chats?.length ?? 0;

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white p-4 shadow-sm">
      {/* Pending / Resolved Tabs */}
      <div className="mb-4 flex items-center justify-between gap-1 rounded-full bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("pending")}
          className={cn(
            "relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
            activeTab === "pending"
              ? "bg-[#2196F3] text-white"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
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
          Pending
          {chatCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {chatCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("resolved")}
          className={cn(
            "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
            activeTab === "resolved"
              ? "bg-[#2196F3] text-white"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
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
          Resolved
        </button>
      </div>

      {/* Chat Session Items */}
      <div className="scrollbar-none flex-1 space-y-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : !chats || chats.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No conversations found.
          </div>
        ) : (
          chats.map((chat) => {
            let displayTime = "";
            if (chat.updated_at) {
              try {
                displayTime = format(
                  new Date(chat.updated_at),
                  "h:mma",
                ).toLowerCase();
              } catch {
                displayTime = "";
              }
            }

            // Format session_id as a short readable label
            const sessionLabel = chat.session_id
              ? chat.session_id.slice(0, 13).toUpperCase()
              : "UNKNOWN";

            return (
              <button
                key={chat.id}
                onClick={() => onSelectTicket(chat.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
                  selectedTicketId === chat.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50",
                )}
              >
                {/* Castle Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6433CC] to-[#F25430]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M4 20V10L6 8V4H8V6H10V4H14V6H16V4H18V8L20 10V20H4Z"
                      fill="currentColor"
                    />
                    <rect
                      x="8"
                      y="12"
                      width="3"
                      height="4"
                      rx="0.5"
                      fill="#6433CC"
                    />
                    <rect
                      x="13"
                      y="12"
                      width="3"
                      height="4"
                      rx="0.5"
                      fill="#6433CC"
                    />
                    <rect
                      x="10"
                      y="16"
                      width="4"
                      height="4"
                      rx="0.5"
                      fill="#6433CC"
                    />
                  </svg>
                </div>

                {/* Chat Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-dm-mono truncate text-sm font-bold text-gray-900">
                      {sessionLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-stolzl truncate text-xs text-gray-400">
                      {chat.message_count}{" "}
                      {chat.message_count === 1 ? "message" : "messages"}
                    </span>
                    <span className="font-stolzl shrink-0 text-xs text-[#2196F3]">
                      {displayTime}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
