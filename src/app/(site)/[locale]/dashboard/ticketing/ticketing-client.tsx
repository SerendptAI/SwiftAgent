"use client";

import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchOpen) return;
    const id = window.setTimeout(() => searchInputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [isSearchOpen]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

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
      <div className="relative hidden items-center gap-8 lg:flex">
        <div
          aria-hidden={isSearchOpen}
          className={`w-[70%] transition-opacity duration-500 ease-out ${
            isSearchOpen ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <CompanyToolbar />
        </div>
        <div className="mb-4 h-16 w-16" aria-hidden />
        <div
          role={isSearchOpen ? undefined : "button"}
          tabIndex={isSearchOpen ? undefined : 0}
          aria-label={isSearchOpen ? undefined : "Open search"}
          onClick={() => {
            if (!isSearchOpen) setIsSearchOpen(true);
          }}
          onKeyDown={(e) => {
            if (!isSearchOpen && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setIsSearchOpen(true);
            }
          }}
          className={`absolute top-[calc(50%-8px)] right-[calc(30%-6rem)] flex h-16 -translate-y-1/2 items-center overflow-hidden transition-all duration-500 ease-out ${
            isSearchOpen
              ? "w-[calc(70%+6rem)] cursor-default rounded-[22px] border border-[#EDEDED] bg-white px-4 shadow-sm"
              : "w-16 cursor-pointer justify-center rounded-3xl border border-transparent bg-[#006BE5] hover:bg-[#1E88E5]"
          }`}
        >
          <div
            className={`flex shrink-0 items-center justify-center transition-all duration-500 ease-out ${
              isSearchOpen
                ? "h-9 w-9 rounded-full bg-[#006BE5] p-2"
                : "h-12 w-12"
            }`}
          >
            <Icons.SearchWhite className="h-full w-full text-white" />
          </div>

          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeSearch();
            }}
            placeholder="Search tickets by name, email, or subject"
            tabIndex={isSearchOpen ? 0 : -1}
            aria-hidden={!isSearchOpen}
            className={`font-dm-mono min-w-0 bg-transparent text-sm tracking-wider text-black uppercase transition-opacity duration-500 ease-out placeholder:text-black/40 focus:outline-none ${
              isSearchOpen
                ? "ml-3 flex-1 opacity-100 delay-200"
                : "w-0 opacity-0"
            }`}
          />

          <button
            type="button"
            aria-label="Close search"
            onClick={(e) => {
              e.stopPropagation();
              closeSearch();
            }}
            tabIndex={isSearchOpen ? 0 : -1}
            aria-hidden={!isSearchOpen}
            className={`flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-black/60 transition-all duration-500 ease-out hover:bg-black/5 hover:text-black ${
              isSearchOpen
                ? "ml-1 w-8 opacity-100 delay-200"
                : "pointer-events-none w-0 opacity-0"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-stretch gap-3 sm:items-center sm:gap-4 lg:hidden">
        <div className="min-w-0 flex-1">
          <CompanyToolbar />
        </div>
        <div className="mb-4 flex shrink-0 items-center self-stretch">
          <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-[#006BE5] text-white transition-colors hover:bg-[#1E88E5] sm:h-14 sm:w-14">
            <Icons.SearchWhite className="h-8 w-8" />
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
            searchQuery={searchQuery}
          />
        )}
        {activeChannel === "forms" && <FormsTabContent />}
        {activeChannel === "mail" && <BusinessEmailsTabContent />}
      </div>
    </div>
  );
}
