"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { BusinessEmailsTabContent } from "@/components/dashboard/ticketing/business-emails-tab-content";
import type { ChannelKey } from "@/components/dashboard/ticketing/channel-navigator";
import { ChannelNavigator } from "@/components/dashboard/ticketing/channel-navigator";
import { FormsTabContent } from "@/components/dashboard/ticketing/forms-tab-content";
import type { TicketKind } from "@/components/dashboard/ticketing/ticket-list";
import { TicketsTabContent } from "@/components/dashboard/ticketing/tickets-tab-content";
import { Icons } from "@/components/icons";
import { useResolvedChats } from "@/hooks/use-conversations";

function getChannelFromTabParam(tab: string | null): ChannelKey | null {
  if (tab === "tickets" || tab === "forms" || tab === "mail") return tab;
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

  const { data: chats } = useResolvedChats();

  // Auto-select chat from URL query param (e.g. ?chat=abc123) — resolved side
  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId && chats?.some((c) => c.id === chatId)) {
      setActiveChannel("tickets");
      setSelection({ id: chatId, kind: "chat" });
    }
  }, [searchParams, chats]);

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
    <div className="flex min-h-full w-full flex-col gap-4 lg:gap-8">
      <div className="flex items-stretch gap-3 sm:items-center sm:gap-4 lg:gap-8">
        <div className="min-w-0 flex-1 lg:w-[70%] lg:flex-none">
          <CompanyToolbar />
        </div>
        <div className="mb-4 flex shrink-0 items-center self-stretch">
          <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-[#006BE5] text-white transition-colors hover:bg-[#1E88E5] sm:h-14 sm:w-14 lg:h-auto lg:w-auto lg:rounded-3xl lg:p-2">
            <Icons.SearchWhite className="h-8 w-8 lg:h-12 lg:w-12" />
          </button>
        </div>
      </div>

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
          />
        )}
        {activeChannel === "forms" && <FormsTabContent />}
        {activeChannel === "mail" && <BusinessEmailsTabContent />}
      </div>
    </div>
  );
}
