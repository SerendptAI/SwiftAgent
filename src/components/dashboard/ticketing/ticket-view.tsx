"use client";

import { format } from "date-fns";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Maximize2,
  MessageSquare,
  Paperclip,
  Send,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import {
  useMarkTicketSeen,
  useReplyToTicket,
  useTicket,
} from "@/hooks/use-tickets";
import { resolveAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

import { MessageMarkdown } from "./message-markdown";

function MessageEmptyState() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white shadow-sm">
      <div className="flex flex-col items-center gap-8 text-center">
        <Image
          src="/images/email-mailbox-open.svg"
          alt=""
          width={66}
          height={66}
          className="aspect-[66/66] w-full max-w-[66px]"
        />
        <p className="font-dm-mono text-center text-sm leading-[1.39] font-normal tracking-[0.1em] text-black/60 uppercase">
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

interface TicketViewProps {
  ticketId: string;
}

export function TicketView({ ticketId }: TicketViewProps) {
  const companyId = useActiveCompanyId();
  const { data: ticket, isFetching } = useTicket(ticketId);
  const { mutate: markSeen } = useMarkTicketSeen();
  const { mutate: reply, isPending: isSending } = useReplyToTicket();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [showOriginalChat, setShowOriginalChat] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages?.length]);

  useEffect(() => {
    if (ticket && ticket.unseen_count > 0 && companyId) {
      markSeen({ companyId, ticketId: ticket.id });
    }
  }, [ticket, companyId, markSeen]);

  if (!ticket && !isFetching) {
    return <MessageEmptyState />;
  }

  const messages = ticket?.messages ?? [];
  const avatar = resolveAvatarUrl(ticket?.avatar);
  const title =
    ticket?.customer_name?.trim() || ticket?.customer_email || "Ticket";

  let headerTime = "";
  if (messages.length > 0 && messages[0].timestamp) {
    try {
      headerTime = format(new Date(messages[0].timestamp), "EEE h:mm a");
    } catch {
      // ignore
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const body_text = draft.trim();
    if (!body_text || !companyId || !ticket) return;
    reply(
      { companyId, ticketId: ticket.id, payload: { body_text } },
      { onSuccess: () => setDraft("") },
    );
  };

  return (
    <div className="relative flex h-full flex-col rounded-3xl bg-white shadow-sm">
      {isFetching && (
        <div className="absolute top-0 right-0 left-0 z-10 ml-4 h-0.5 overflow-hidden rounded-t-3xl">
          <div
            className="h-full w-1/3 animate-pulse rounded-full bg-[#2196F3]"
            style={{ animation: "loading 1s ease-in-out infinite" }}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt="Ticket avatar" width={36} height={31} />
          </div>
          <div className="min-w-0">
            <div className="font-dm-mono truncate text-sm font-bold tracking-wider text-gray-900 uppercase">
              {title}
            </div>
            {ticket?.subject && (
              <div className="font-stolzl truncate text-xs text-gray-500">
                {ticket.subject}
              </div>
            )}
          </div>
        </div>
        <button
          aria-label="Expand"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Originating chat (collapsible) */}
      {ticket?.attributed_chat && (
        <div className="border-b border-gray-100 px-6 py-3">
          <button
            type="button"
            onClick={() => setShowOriginalChat((v) => !v)}
            className="flex w-full cursor-pointer items-center gap-2 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:text-gray-700"
            aria-expanded={showOriginalChat}
          >
            {showOriginalChat ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
            <MessageSquare className="h-3.5 w-3.5" />
            Original chat ({ticket.attributed_chat.messages.length}{" "}
            {ticket.attributed_chat.messages.length === 1
              ? "message"
              : "messages"}
            )
          </button>
          {showOriginalChat && (
            <div className="mt-3 max-h-72 space-y-3 overflow-y-auto rounded-2xl bg-gray-50 px-4 py-3">
              {ticket.attributed_chat.messages.map((message, i) => {
                const isVisitor = message.role === "user";
                return (
                  <div
                    key={`chat-${i}`}
                    className={cn(
                      "flex",
                      isVisitor ? "justify-start" : "justify-end",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed [overflow-wrap:anywhere]",
                        isVisitor
                          ? "rounded-bl-sm bg-white text-[#303437]"
                          : "rounded-br-sm bg-[#F2F8FF] text-[#006BE5]",
                      )}
                    >
                      <MessageMarkdown text={message.content} compact />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="scrollbar-none flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {headerTime && (
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400">{headerTime}</span>
          </div>
        )}

        {messages.map((message, i) => {
          const isCustomer = message.direction === "inbound";
          const body = message.body_text ?? "";
          const isLong = body.length > 60 || body.includes("\n");
          return (
            <div
              key={`${ticket?.id}-${i}`}
              className={cn(
                "flex items-end gap-2",
                isCustomer ? "justify-start" : "justify-end",
              )}
            >
              {isCustomer && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatar} alt="Customer" width={22} height={19} />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] px-4 py-3 text-sm leading-relaxed [overflow-wrap:anywhere]",
                  isCustomer
                    ? "rounded-2xl rounded-bl-sm bg-[#F2F4F5] text-[#303437]"
                    : isLong
                      ? "rounded-2xl rounded-br-sm bg-[#F2F8FF] text-[#006BE5]"
                      : "rounded-full bg-[#F2F8FF] text-[#006BE5]",
                )}
              >
                <MessageMarkdown text={body} />
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply composer */}
      <div className="border-t border-gray-100 px-4 py-3">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a reply..."
            disabled={isSending}
            className="font-dm-mono flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:opacity-60"
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
            disabled={!draft.trim() || isSending}
            aria-label="Send"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:text-[#006BE5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4 -translate-x-px" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
