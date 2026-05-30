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
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useCurrentUser } from "@/hooks/use-auth";
import {
  useMarkTicketSeen,
  useReplyToTicket,
  useTicket,
} from "@/hooks/use-tickets";
import { resolveAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";
import {
  type AttachmentMeta,
  MAX_REPLY_ATTACHMENT_BYTES,
  MAX_REPLY_ATTACHMENTS,
} from "@/services/tickets";

import { MessageMarkdown } from "./message-markdown";

/** Format a byte count as a human-readable size (e.g. "1.0 MB"). */
function formatBytes(bytes?: number | null): string {
  if (bytes == null || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / Math.pow(1024, i);
  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`;
}

/** Informational tag for a file attached to a message (not downloadable). */
function AttachmentTag({
  attachment,
  tone,
}: {
  attachment: AttachmentMeta;
  tone: "customer" | "support";
}) {
  const size = formatBytes(attachment.size);
  return (
    <span
      className={cn(
        "font-dm-mono inline-flex max-w-full items-center gap-1.5 rounded-lg px-2 py-1 text-xs",
        tone === "customer"
          ? "bg-black/[0.04] text-[#303437]"
          : "bg-[#006BE5]/10 text-[#006BE5]",
      )}
    >
      <Paperclip className="h-3 w-3 shrink-0" />
      <span className="truncate">{attachment.filename}</span>
      {size && <span className="shrink-0 opacity-60">({size})</span>}
    </span>
  );
}

function MessageEmptyState() {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center rounded-[20px] bg-white px-4 pb-20 shadow-sm lg:h-full lg:rounded-3xl lg:pb-0">
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
  className?: string;
  onClose?: () => void;
}

export function TicketView({ ticketId, className, onClose }: TicketViewProps) {
  const companyId = useActiveCompanyId();
  const { data: ticket, isFetching } = useTicket(ticketId);
  const { data: currentUser } = useCurrentUser();
  const { mutate: markSeen } = useMarkTicketSeen();
  const { mutate: reply, isPending: isSending } = useReplyToTicket();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [attachError, setAttachError] = useState<string | null>(null);
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

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    // Allow re-selecting the same file later.
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (picked.length === 0) return;

    const oversized = picked.filter((f) => f.size > MAX_REPLY_ATTACHMENT_BYTES);
    if (oversized.length > 0) {
      setAttachError(`Each file must be 10MB or smaller.`);
      const allowed = picked.filter(
        (f) => f.size <= MAX_REPLY_ATTACHMENT_BYTES,
      );
      if (allowed.length === 0) return;
      addFiles(allowed);
      return;
    }
    addFiles(picked);
  };

  const addFiles = (incoming: File[]) => {
    setFiles((prev) => {
      const combined = [...prev, ...incoming];
      if (combined.length > MAX_REPLY_ATTACHMENTS) {
        setAttachError(`You can attach up to ${MAX_REPLY_ATTACHMENTS} files.`);
        return combined.slice(0, MAX_REPLY_ATTACHMENTS);
      }
      setAttachError(null);
      return combined;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setAttachError(null);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const body_text = draft.trim();
    if (!body_text || !companyId || !ticket || isSending) return;
    reply(
      {
        companyId,
        ticketId: ticket.id,
        payload: {
          body_text,
          replier_name: currentUser?.name || currentUser?.email,
          replier_picture: currentUser?.picture ?? null,
          attachments: files.length > 0 ? files : undefined,
        },
      },
      {
        onSuccess: () => {
          setDraft("");
          setFiles([]);
          setAttachError(null);
        },
      },
    );
  };

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[520px] flex-col rounded-[20px] bg-white shadow-sm lg:min-h-0 lg:rounded-3xl",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
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
          type="button"
          aria-label={onClose ? "Close conversation" : "Expand"}
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          {onClose ? (
            <X className="h-4 w-4 lg:hidden" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
          {onClose && <Maximize2 className="hidden h-4 w-4 lg:block" />}
        </button>
      </div>

      {/* Originating chat (collapsible) */}
      {ticket?.attributed_chat && (
        <div className="border-b border-gray-100 px-4 py-3 sm:px-6">
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
      <div className="scrollbar-none flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
        {headerTime && (
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400">{headerTime}</span>
          </div>
        )}

        {messages.map((message, i) => {
          const body = message.body_text ?? "";
          if (message.direction === "system") {
            return (
              <div key={`${ticket?.id}-${i}`} className="flex justify-center">
                <div className="max-w-[85%] rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-relaxed [overflow-wrap:anywhere] text-gray-500">
                  <div className="font-dm-mono mb-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                    System note
                  </div>
                  <MessageMarkdown text={body} compact />
                </div>
              </div>
            );
          }

          const isCustomer = message.direction === "inbound";
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
                    : isLong || (message.attachments?.length ?? 0) > 0
                      ? "rounded-2xl rounded-br-sm bg-[#F2F8FF] text-[#006BE5]"
                      : "rounded-full bg-[#F2F8FF] text-[#006BE5]",
                )}
              >
                {body && <MessageMarkdown text={body} />}
                {message.attachments && message.attachments.length > 0 && (
                  <div className={cn("flex flex-wrap gap-1.5", body && "mt-2")}>
                    {message.attachments.map((attachment, j) => (
                      <AttachmentTag
                        key={`${ticket?.id}-${i}-att-${j}`}
                        attachment={attachment}
                        tone={isCustomer ? "customer" : "support"}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply composer */}
      <div className="border-t border-gray-100 px-4 py-3">
        {files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {files.map((file, i) => (
              <span
                key={`${file.name}-${i}`}
                className="font-dm-mono inline-flex max-w-full items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700"
              >
                <Paperclip className="h-3 w-3 shrink-0" />
                <span className="max-w-[160px] truncate">{file.name}</span>
                <span className="shrink-0 text-gray-400">
                  ({formatBytes(file.size)})
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(i)}
                  disabled={isSending}
                  className="shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-700 disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {attachError && (
          <p className="font-dm-mono mb-2 text-xs text-red-500">
            {attachError}
          </p>
        )}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
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
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || files.length >= MAX_REPLY_ATTACHMENTS}
            className="shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
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
