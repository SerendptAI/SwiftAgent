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

    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", channel);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const handleSelectItem = (id: string, kind: TicketKind) => {
    setSelection({ id, kind });
  };

  return (
    <div className="flex h-full w-full flex-col gap-8">
      <div className="flex items-center gap-8">
        <div className="w-[70%]">
          <CompanyToolbar />
        </div>
        <div className="mb-4 flex items-center">
          <button className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#006BE5] p-2 text-white transition-colors hover:bg-[#1E88E5]">
            <Icons.SearchWhite className="h-12 w-12" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-8">
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
          />
        )}
        {activeChannel === "forms" && <FormsTabContent />}
        {activeChannel === "mail" && <BusinessEmailsTabContent />}
      </div>
    </div>
  );
}
