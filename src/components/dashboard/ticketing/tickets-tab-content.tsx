"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ChatView } from "@/components/dashboard/ticketing/chat-view";
import type { TicketKind } from "@/components/dashboard/ticketing/ticket-list";
import { TicketList } from "@/components/dashboard/ticketing/ticket-list";
import { TicketView } from "@/components/dashboard/ticketing/ticket-view";
import { useScrollLock } from "@/hooks/use-scroll-lock";

interface TicketSelection {
  id: string;
  kind: TicketKind;
}

interface TicketsTabContentProps {
  selection: TicketSelection | null;
  onClearSelection: () => void;
  onSelectItem: (id: string, kind: TicketKind) => void;
  searchQuery?: string;
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
  onClearSelection,
  searchQuery,
}: TicketsTabContentProps) {
  const [isMobileDetail, setIsMobileDetail] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateMatch = () => setIsMobileDetail(mediaQuery.matches);

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useScrollLock(Boolean(selection) && isMobileDetail);

  const conversation = selection ? (
    selection.kind === "ticket" ? (
      <TicketView ticketId={selection.id} />
    ) : (
      <ChatView ticketId={selection.id} />
    )
  ) : (
    <MessageEmptyState />
  );

  const mobileConversation = selection ? (
    selection.kind === "ticket" ? (
      <TicketView
        ticketId={selection.id}
        className="min-h-0 rounded-none shadow-none"
        onClose={onClearSelection}
      />
    ) : (
      <ChatView
        ticketId={selection.id}
        className="min-h-0 rounded-none shadow-none"
        onClose={onClearSelection}
      />
    )
  ) : null;

  return (
    <>
      <div className="w-full shrink-0 lg:h-full lg:min-h-0 lg:w-[320px]">
        <TicketList
          selectedItemId={selection?.id ?? ""}
          onSelectItem={onSelectItem}
          searchQuery={searchQuery}
        />
      </div>

      <div className="hidden min-h-[520px] min-w-0 flex-1 lg:block lg:min-h-0">
        {conversation}
      </div>

      {selection && isMobileDetail && (
        <div className="fixed inset-0 z-10000 bg-black/45 lg:hidden">
          <section className="animate-in slide-in-from-right ml-auto flex h-full w-full max-w-[520px] flex-col bg-white shadow-[-20px_0_70px_rgba(0,0,0,0.18)] duration-300">
            <div className="min-h-0 flex-1">{mobileConversation}</div>
          </section>
        </div>
      )}
    </>
  );
}
