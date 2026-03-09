import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { useCurrentUser } from "@/hooks/use-auth";
import { useChat, useMarkChatSeen } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

const AVATAR_IMAGES = [
  "/images/chats/img1.svg",
  "/images/chats/img2.svg",
  "/images/chats/img3.svg",
];

interface ChatViewProps {
  ticketId: string;
  avatarIndex?: number;
}

export function ChatView({ ticketId, avatarIndex = 0 }: ChatViewProps) {
  const { data: user } = useCurrentUser();
  const companyId = user?.company_id;
  const { data: chat, isFetching } = useChat(ticketId);
  const { mutate: markSeen } = useMarkChatSeen();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Mark chat as seen when opened
  useEffect(() => {
    if (chat && !chat.seen && companyId) {
      markSeen({ companyId, chatId: chat.id });
    }
  }, [chat, companyId, markSeen]);

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
        <div className="absolute top-0 right-0 left-0 z-10 ml-4 h-0.5 overflow-hidden rounded-t-3xl">
          <div
            className="h-full w-1/3 animate-pulse rounded-full bg-[#2196F3]"
            style={{ animation: "loading 1s ease-in-out infinite" }}
          />
        </div>
      )}

      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
          <Image
            src={AVATAR_IMAGES[avatarIndex % AVATAR_IMAGES.length]}
            alt="Chat avatar"
            width={36}
            height={31}
          />
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

        {messages.map((message, i) => {
          const isUser = message.role === "user";
          return (
            <div
              key={`${chat?.id}-${i}`}
              className={cn("flex", isUser ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                  isUser
                    ? "bg-[#F2F8FF] text-[#006BE5]"
                    : "bg-[#F2F8FF] text-gray-900",
                )}
              >
                {message.content}
              </div>
            </div>
          );
        })}
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
