"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardSearchToolbar } from "@/components/dashboard/dashboard-search-toolbar";
import { BusinessEmailsTabContent } from "@/components/dashboard/ticketing/business-emails-tab-content";
import type { ChannelKey } from "@/components/dashboard/ticketing/channel-navigator";
import { ChannelNavigator } from "@/components/dashboard/ticketing/channel-navigator";
import { FormsTabContent } from "@/components/dashboard/ticketing/forms-tab-content";
import type { TicketKind } from "@/components/dashboard/ticketing/ticket-list";
import { TicketsTabContent } from "@/components/dashboard/ticketing/tickets-tab-content";
import { useResolvedChats } from "@/hooks/use-conversations";

function getChannelFromTabParam(tab: string | null): ChannelKey | null {
  if (tab === "tickets" || tab === "forms") return tab;
  return null;
}

export function TicketingClient() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selection, setSelection] = useState<{
    id: string;
    kind: TicketKind;
  } | null>(null);
  const [activeChannel, setActiveChannel] = useState<ChannelKey>(
    () => getChannelFromTabParam(searchParams.get("tab")) ?? "tickets",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: chats } = useResolvedChats();

  // Auto-select chat from URL query param (e.g. ?chat=abc123) — resolved side
  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId && chats?.some((c) => c.id === chatId)) {
      setActiveChannel("tickets");
      setSelection({ id: chatId, kind: "chat" });
    }
  }, [searchParams, chats]);

  // Auto-select a ticket from URL query param (e.g. ?ticket=A3F8B2C1) — used by
  // notification deep-links. The ticket may be resolved (and absent from the
  // unresolved list), so we select by id directly; TicketView fetches it.
  useEffect(() => {
    const ticketId = searchParams.get("ticket");
    if (ticketId) {
      setActiveChannel("tickets");
      setSelection({ id: ticketId, kind: "ticket" });
    }
  }, [searchParams]);

  useEffect(() => {
    const channel = getChannelFromTabParam(searchParams.get("tab"));
    if (channel && channel !== activeChannel) {
      setActiveChannel(channel);
    }
  }, [searchParams, activeChannel]);

  const handleChannelChange = (channel: ChannelKey) => {
    setActiveChannel(channel);
    setSelection(null);

    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", channel);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const handleSelectItem = (id: string, kind: TicketKind) => {
    setSelection({ id, kind });
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-4 lg:h-full lg:min-h-0 lg:gap-8">
      <DashboardSearchToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Search tickets by name, email, or subject"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="shrink-0">
          <ChannelNavigator
            active={activeChannel}
            onChange={handleChannelChange}
          />
        </div>

        {activeChannel === "tickets" && (
          <TicketsTabContent
            selection={selection}
            onSelectItem={handleSelectItem}
            onClearSelection={() => setSelection(null)}
            searchQuery={searchQuery}
          />
        )}
        {activeChannel === "forms" && <FormsTabContent />}
        {/* {activeChannel === "mail" && <BusinessEmailsTabContent />} */}
      </div>
    </div>
  );
}
