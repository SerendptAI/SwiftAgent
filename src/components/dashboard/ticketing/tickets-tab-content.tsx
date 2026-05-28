"use client";

import Image from "next/image";

import { ChatView } from "@/components/dashboard/ticketing/chat-view";
import type { TicketKind } from "@/components/dashboard/ticketing/ticket-list";
import { TicketList } from "@/components/dashboard/ticketing/ticket-list";
import { TicketView } from "@/components/dashboard/ticketing/ticket-view";

interface TicketSelection {
  id: string;
  kind: TicketKind;
}

interface TicketsTabContentProps {
  selection: TicketSelection | null;
  onSelectItem: (id: string, kind: TicketKind) => void;
  searchQuery?: string;
}

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
          WHEN YOU GET MESSAGES THEY&apos;LL
          <br />
          APPEAR HERE
        </p>
      </div>
    </div>
  );
}

export function TicketsTabContent({
  selection,
  onSelectItem,
  searchQuery,
}: TicketsTabContentProps) {
  return (
    <>
      <div className="w-[320px] shrink-0">
        <TicketList
          selectedItemId={selection?.id ?? ""}
          onSelectItem={onSelectItem}
          searchQuery={searchQuery}
        />
      </div>

      <div className="min-w-0 flex-1">
        {selection ? (
          selection.kind === "ticket" ? (
            <TicketView ticketId={selection.id} />
          ) : (
            <ChatView ticketId={selection.id} />
          )
        ) : (
          <MessageEmptyState />
        )}
      </div>
    </>
  );
}
