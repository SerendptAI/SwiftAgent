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
        <div
          aria-hidden={isSearchOpen}
          className={`w-[70%] transition-opacity duration-500 ease-out ${
            isSearchOpen ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <CompanyToolbar />
        </div>

        {/* Search slot — button morphs in place, growing LEFTWARD (right edge anchored) */}
        <div className="relative mb-4 h-16 w-16">
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
            className={`absolute top-0 right-0 flex h-16 items-center overflow-hidden transition-all duration-500 ease-out ${
              isSearchOpen
                ? "w-200 max-w-[80vw] cursor-default rounded-[22px] border border-[#EDEDED] bg-white px-4 shadow-sm"
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
              className={`font-dm-mono min-w-0 flex-1 bg-transparent text-sm tracking-wider text-black uppercase transition-opacity duration-500 ease-out placeholder:text-black/40 focus:outline-none ${
                isSearchOpen ? "ml-3 opacity-100 delay-200" : "w-0 opacity-0"
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
            searchQuery={searchQuery}
          />
        )}
        {activeChannel === "forms" && <FormsTabContent />}
        {activeChannel === "mail" && <BusinessEmailsTabContent />}
      </div>
    </div>
  );
}
