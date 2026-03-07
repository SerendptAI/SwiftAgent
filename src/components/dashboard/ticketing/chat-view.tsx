import { format } from "date-fns";
import { useEffect, useRef } from "react";

import { useChat } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

interface ChatViewProps {
  ticketId: string;
}

export function ChatView({ ticketId }: ChatViewProps) {
  const { data: chat, isFetching } = useChat(ticketId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat && !isFetching) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white text-gray-500 shadow-sm">
        Select a conversation to view messages.
      </div>
    );
  }

  const messages = chat?.messages ?? [];

  // Try to format the first message timestamp as header
  let headerTime = "";
  if (messages.length > 0 && messages[0].timestamp) {
    try {
      headerTime = format(new Date(messages[0].timestamp), "EEE h:mm a");
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative flex h-full flex-col rounded-3xl bg-white shadow-sm">
      {/* Subtle loading bar */}
      {isFetching && (
        <div className="absolute top-0 right-0 left-0 z-10 h-0.5 overflow-hidden rounded-t-3xl">
          <div
            className="h-full w-1/3 animate-pulse rounded-full bg-[#2196F3]"
            style={{ animation: "loading 1s ease-in-out infinite" }}
          />
        </div>
      )}

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
        <div className="flex flex-col">
          <span className="font-dm-mono text-sm font-bold text-gray-900">
            {chat?.session_id
              ? `Session ${chat.session_id.slice(0, 8)}…`
              : "Conversation"}
          </span>
          <span className="font-stolzl text-xs text-gray-400">
            {chat?.message_count ?? 0} messages
          </span>
        </div>
      </div>

      {/* Messages Area (read-only) */}
      <div className="scrollbar-none flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {headerTime && (
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400">{headerTime}</span>
          </div>
        )}

        {messages.map((message, i) => (
          <div
            key={`${chat?.id}-${i}`}
            className={cn(
              "flex",
              message.role === "agent" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                message.role === "agent"
                  ? "bg-[#2196F3] text-white"
                  : "bg-gray-100 text-gray-900",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Read-only footer */}
      <div className="border-t border-gray-100 px-6 py-4">
        <p className="font-stolzl text-center text-xs text-gray-400">
          This is a read-only view of a widget conversation.
        </p>
      </div>
    </div>
  );
}
