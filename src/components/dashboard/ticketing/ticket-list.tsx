"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export interface Ticket {
  id: string;
  visitorId: string;
  preview: string;
  time: string;
}

export const TICKETS: Ticket[] = [
  {
    id: "1",
    visitorId: "V1GSHST-TAR6282",
    preview: "Good day, I lost my...",
    time: "4:12pm",
  },
  {
    id: "2",
    visitorId: "V1GSHST-TAR6282",
    preview: "Good day, I lost my...",
    time: "4:11pm",
  },
  {
    id: "3",
    visitorId: "V1GSHST-TAR6282",
    preview: "Good day, I lost my...",
    time: "4:10pm",
  },
];

interface TicketListProps {
  selectedTicketId: string;
  onSelectTicket: (id: string) => void;
}

export function TicketList({
  selectedTicketId,
  onSelectTicket,
}: TicketListProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");

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
        {TICKETS.map((ticket) => (
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
                <span className="truncate text-sm font-bold text-gray-900">
                  {ticket.visitorId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="truncate text-xs text-gray-400">
                  {ticket.preview}
                </span>
                <span className="shrink-0 text-xs text-gray-400">
                  {ticket.time}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
