import { format } from "date-fns";
import { Maximize2, Paperclip, Send } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useCurrentUser } from "@/hooks/use-auth";
import { useChat, useMarkChatSeen } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

const AVATAR_IMAGES = [
  "/images/chats/newimg.svg",
  "/images/chats/newimg1.svg",
  "/images/chats/newimg2.svg",
  "/images/chats/newimg3.svg",
  "/images/chats/newimg4.svg",
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
  const [draft, setDraft] = useState("");

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
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
            <Image
              src={AVATAR_IMAGES[avatarIndex % AVATAR_IMAGES.length]}
              alt="Chat avatar"
              width={36}
              height={31}
            />
          </div>
          <span className="font-dm-mono text-sm font-bold tracking-wider text-gray-900 uppercase">
            {chat?.session_id
              ? chat.session_id.slice(0, 13).toUpperCase()
              : "Conversation"}
          </span>
        </div>
        <button
          aria-label="Expand"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Area (read-only) */}
      <div className="scrollbar-none flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {headerTime && (
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400">{headerTime}</span>
          </div>
        )}

        {messages.map((message, i) => {
          const isVisitor = message.role === "user";
          const isLong =
            message.content.length > 60 || message.content.includes("\n");
          return (
            <div
              key={`${chat?.id}-${i}`}
              className={cn(
                "flex items-end gap-2",
                isVisitor ? "justify-start" : "justify-end",
              )}
            >
              {isVisitor && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                  <Image
                    src={AVATAR_IMAGES[avatarIndex % AVATAR_IMAGES.length]}
                    alt="Visitor"
                    width={22}
                    height={19}
                  />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] px-4 py-3 text-sm leading-relaxed",
                  isVisitor
                    ? "rounded-2xl rounded-bl-sm bg-[#F2F4F5] text-[#303437]"
                    : isLong
                      ? "rounded-2xl rounded-br-sm bg-[#F2F8FF] text-[#006BE5]"
                      : "rounded-full bg-[#F2F8FF] text-[#006BE5]",
                )}
              >
                {message.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-gray-100 px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const message = draft.trim();
            if (!message) return;
            // TODO: wire up to send-message endpoint when available
            console.log("Send message:", message);
            setDraft("");
          }}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className="font-dm-mono flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            aria-label="Attach"
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-[#006BE5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4 -translate-x-px" />
          </button>
        </form>
      </div>
    </div>
  );
}
