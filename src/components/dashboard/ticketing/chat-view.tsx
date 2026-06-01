import { format } from "date-fns";
import { Maximize2, Minimize2, Paperclip, Send, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useChat, useMarkChatSeen } from "@/hooks/use-conversations";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { resolveAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

import { MessageMarkdown } from "./message-markdown";

function MessageEmptyState() {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center rounded-[20px] bg-white px-4 pb-20 shadow-sm lg:h-full lg:rounded-3xl lg:pb-0">
      <div className="flex flex-col items-center gap-8 text-center">
        <Image
          src="/images/email-mailbox-open.svg"
          alt=""
          width={66}
          height={66}
          className="aspect-66/66 w-full max-w-[66px]"
        />
        <p className="font-dm-mono text-center text-sm leading-[1.39] font-normal tracking-widest text-black/60 uppercase">
          NOTHING HERE FOR NOW,
          <br />
          WHEN YOU GET MESSAGES THEY’LL
          <br />
          APPEAR HERE
        </p>
      </div>
    </div>
  );
}

interface ChatViewProps {
  ticketId: string;
  className?: string;
  onClose?: () => void;
}

export function ChatView({ ticketId, className, onClose }: ChatViewProps) {
  const companyId = useActiveCompanyId();
  const { data: chat, isFetching } = useChat(ticketId);
  const { mutate: markSeen } = useMarkChatSeen();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const avatarSrc = resolveAvatarUrl(chat?.avatar);

  useScrollLock(isFullscreen);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  // Mark chat as seen when opened
  useEffect(() => {
    if (chat && !chat.seen && companyId) {
      markSeen({ companyId, chatId: chat.id });
    }
  }, [chat, companyId, markSeen]);

  if (!chat && !isFetching) {
    return <MessageEmptyState />;
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

  const body = (
    <>
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarSrc} alt="Chat avatar" width={36} height={31} />
          </div>
          <span className="font-dm-mono min-w-0 truncate text-sm font-bold tracking-wider text-gray-900 uppercase">
            {chat?.session_id
              ? chat.session_id.slice(0, 13).toUpperCase()
              : "Conversation"}
          </span>
        </div>
        <button
          type="button"
          aria-label={
            onClose
              ? "Close conversation"
              : isFullscreen
                ? "Exit fullscreen"
                : "Expand"
          }
          onClick={onClose ?? (() => setIsFullscreen((v) => !v))}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          {onClose ? (
            <X className="h-4 w-4 lg:hidden" />
          ) : isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
          {onClose && <Maximize2 className="hidden h-4 w-4 lg:block" />}
        </button>
      </div>

      {/* Messages Area (read-only) */}
      <div className="scrollbar-none flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarSrc} alt="Visitor" width={22} height={19} />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] px-4 py-3 text-sm leading-relaxed [overflow-wrap:anywhere]",
                  isVisitor
                    ? "rounded-2xl rounded-bl-sm bg-[#F2F4F5] text-[#303437]"
                    : isLong
                      ? "rounded-2xl rounded-br-sm bg-[#F2F8FF] text-[#006BE5]"
                      : "rounded-full bg-[#F2F8FF] text-[#006BE5]",
                )}
              >
                <MessageMarkdown text={message.content} />
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
            className="shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:text-[#006BE5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4 -translate-x-px" />
          </button>
        </form>
      </div>
    </>
  );

  if (isFullscreen) {
    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[10000] flex flex-col bg-white"
      >
        {body}
      </div>,
      document.body,
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[520px] flex-col rounded-[20px] bg-white shadow-sm lg:min-h-0 lg:rounded-3xl",
        className,
      )}
    >
      {body}
    </div>
  );
}
