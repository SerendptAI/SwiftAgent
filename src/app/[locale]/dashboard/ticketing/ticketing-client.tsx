"use client";

import { useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { ChatView } from "@/components/dashboard/ticketing/chat-view";
import { TicketList } from "@/components/dashboard/ticketing/ticket-list";
import { Icons } from "@/components/icons";
import { useChats } from "@/hooks/use-conversations";

export function TicketingClient() {
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: chats } = useChats();
  const chatCount = chats?.length ?? 0;

  const handleSelectTicket = (id: string, index: number) => {
    setSelectedTicketId(id);
    setSelectedIndex(index);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-8">
        <div className="flex-1">
          <CompanyToolbar />
        </div>
        <div className="mb-4 flex w-[350px] items-center">
          <div className="flex items-center gap-4">
            <button className="relative flex cursor-pointer items-center justify-center rounded-3xl bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-200">
              <Icons.inbox className="h-12 w-12" />
              {chatCount > 0 && (
                <span className="absolute top-1.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {chatCount}
                </span>
              )}
            </button>

            {/* Search button */}
            <button className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#2196F3] p-2 text-white transition-colors hover:bg-[#1E88E5]">
              <Icons.SearchWhite className="h-12 w-12" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Left Panel - Chat List */}
        <div className="w-[320px] shrink-0">
          <TicketList
            selectedTicketId={selectedTicketId}
            onSelectTicket={handleSelectTicket}
          />
        </div>

        {/* Right Panel - Chat View */}
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
