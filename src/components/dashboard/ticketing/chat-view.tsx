"use client";

import { RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "agent" | "user" | "system";
  content: string;
  time?: string;
}

const MESSAGES: Message[] = [
  {
    id: "1",
    type: "agent",
    content: "Hey there! 👋 How can I help you?",
    time: "Wed 8:21 AM",
  },
  {
    id: "2",
    type: "user",
    content: "I'd like to schedule a gym appointment",
  },
  {
    id: "3",
    type: "agent",
    content:
      "Great, can we get your email so we email the options available to you?",
  },
  {
    id: "4",
    type: "user",
    content: "dab@serendptai.com",
  },
  {
    id: "5",
    type: "agent",
    content: "We'll email you the options available to...",
  },
];

interface ChatViewProps {
  ticketId: string;
}

export function ChatView({ ticketId: _ticketId }: ChatViewProps) {
  return (
    <div className="flex h-full flex-col rounded-3xl bg-white shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F25430]/10">
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
        <span className="text-sm font-bold text-gray-900">V1GSHST-TAR6282</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {/* Timestamp Divider */}
        <div className="flex items-center justify-center">
          <span className="text-xs text-gray-400">Wed 8:21 AM</span>
        </div>

        {MESSAGES.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.type === "agent" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                message.type === "agent"
                  ? "bg-[#2196F3] text-white"
                  : "bg-gray-100 text-gray-900",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Area */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5">
            <span className="shrink-0 text-sm text-gray-500">
              Send gym appointment option to
            </span>
            <span className="rounded-full bg-[#2196F3] px-3 py-1 text-xs font-semibold text-white">
              dab@serendptai.com
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Action chip - appointment found */}
            <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-xs font-medium text-red-500">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              Gym appointment details found
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Unread count badge */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F25430] text-xs font-bold text-white">
              6
            </div>

            {/* Send button */}
            <button className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
              <RefreshCw className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
