"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import type { ChannelKey } from "@/components/dashboard/ticketing/channel-navigator";
import { ChannelNavigator } from "@/components/dashboard/ticketing/channel-navigator";
import { ChatView } from "@/components/dashboard/ticketing/chat-view";
import { TicketList } from "@/components/dashboard/ticketing/ticket-list";
import { Icons } from "@/components/icons";
import { useChats } from "@/hooks/use-conversations";

export function TicketingClient() {
  const searchParams = useSearchParams();
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeChannel, setActiveChannel] = useState<ChannelKey>("chats");

  const { data: chats } = useChats();

  // Auto-select chat from URL query param (e.g. ?chat=abc123)
  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId && chats) {
      const index = chats.findIndex((c) => c.id === chatId);
      if (index !== -1) {
        setSelectedTicketId(chatId);
        setSelectedIndex(index);
      }
    }
  }, [searchParams, chats]);

  const handleSelectTicket = (id: string, index: number) => {
    setSelectedTicketId(id);
    setSelectedIndex(index);
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
        {/* Channel navigator */}
        <div className="shrink-0">
          <ChannelNavigator
            active={activeChannel}
            onChange={setActiveChannel}
            chatCount={chats?.length ?? 0}
          />
        </div>

        {/* Ticket list */}
        <div className="w-[320px] shrink-0">
          <TicketList
            selectedTicketId={selectedTicketId}
            onSelectTicket={handleSelectTicket}
          />
        </div>

        {/* Chat view */}
        <div className="min-w-0 flex-1">
          {selectedTicketId ? (
            <ChatView ticketId={selectedTicketId} avatarIndex={selectedIndex} />
          ) : (
            <div className="flex h-full items-center justify-center rounded-3xl bg-white text-gray-400 shadow-sm">
              Select a conversation to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
