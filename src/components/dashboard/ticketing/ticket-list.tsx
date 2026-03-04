"use client";

import { format } from "date-fns";
import { useState } from "react";

import { Loader } from "@/components/loader";
import { useConversations } from "@/hooks/use-conversations";
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
  const { data: conversations, isLoading } = useConversations();

  return (
    <div className="flex h-full flex-col">
      {/* Pending / Resolved Tabs */}
      <div className="mb-4 flex items-center gap-1 rounded-full bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("pending")}
          className={cn(
            "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
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

      {/* Ticket Items */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No conversations found.
          </div>
        ) : (
          conversations.map((ticket) => {
            const lastMessage =
              ticket.messages && ticket.messages.length > 0
                ? ticket.messages[ticket.messages.length - 1]
                : null;

            const preview = lastMessage ? lastMessage.content : "No messages yet";

            // Try to extract a timestamp from the last message or fallback to updated_at
            const timeString = lastMessage?.timestamp || ticket.updated_at;
            let displayTime = "";
            if (timeString) {
              try {
                displayTime = format(new Date(timeString), "h:mma").toLowerCase();
              } catch {
                displayTime = "";
              }
            }

            return (
              <button
                key={ticket.id}
                onClick={() => onSelectTicket(ticket.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
                  selectedTicketId === ticket.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50",
                )}
              >
                {/* Visitor Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F25430]/10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-[#F25430]"
                  >
                    <path
                      d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z"
                      fill="currentColor"
                    />
                    <path
                      d="M10 12C6.13401 12 3 14.2386 3 17C3 17.5523 3.44772 18 4 18H16C16.5523 18 17 17.5523 17 17C17 14.2386 13.866 12 10 12Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* Ticket Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-dm-mono truncate text-sm font-bold text-gray-900">
                      {ticket.user_id || "Unknown User"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-stolzl truncate text-xs text-gray-400">
                      {preview}
                    </span>
                    <span className="font-stolzl shrink-0 text-xs text-gray-400">
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
