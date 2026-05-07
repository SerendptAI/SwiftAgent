"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import type { ChannelKey } from "@/components/dashboard/ticketing/channel-navigator";
import { ChannelNavigator } from "@/components/dashboard/ticketing/channel-navigator";
import { ChatView } from "@/components/dashboard/ticketing/chat-view";
import type { TicketKind } from "@/components/dashboard/ticketing/ticket-list";
import { TicketList } from "@/components/dashboard/ticketing/ticket-list";
import { TicketView } from "@/components/dashboard/ticketing/ticket-view";
import { Icons } from "@/components/icons";
import { useChats } from "@/hooks/use-conversations";

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

export function TicketingClient() {
  const searchParams = useSearchParams();
  const [selection, setSelection] = useState<{
    id: string;
    index: number;
    kind: TicketKind;
  } | null>(null);
  const [activeChannel, setActiveChannel] = useState<ChannelKey>("chats");

  const { data: chats } = useChats();

  // Auto-select chat from URL query param (e.g. ?chat=abc123) — resolved side
  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId && chats) {
      const index = chats.findIndex((c) => c.id === chatId);
      if (index !== -1) {
        setSelection({ id: chatId, index, kind: "chat" });
      }
    }
  }, [searchParams, chats]);

  const handleSelectItem = (id: string, index: number, kind: TicketKind) => {
    setSelection({ id, index, kind });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-8">
        <div className="w-[70%]">
          <CompanyToolbar />
        </div>
        <div className="mb-4 flex items-center">
          <button className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#2196F3] p-2 text-white transition-colors hover:bg-[#1E88E5]">
            <Icons.SearchWhite className="h-12 w-12" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="shrink-0">
          <ChannelNavigator
            active={activeChannel}
            onChange={setActiveChannel}
          />
        </div>

        <div className="w-[320px] shrink-0">
          <TicketList
            selectedItemId={selection?.id ?? ""}
            onSelectItem={handleSelectItem}
          />
        </div>

        <div className="min-w-0 flex-1">
          {selection ? (
            selection.kind === "ticket" ? (
              <TicketView
                ticketId={selection.id}
                avatarIndex={selection.index}
              />
            ) : (
              <ChatView ticketId={selection.id} avatarIndex={selection.index} />
            )
          ) : (
            <MessageEmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
