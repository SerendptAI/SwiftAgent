"use client";

import { MessageSquare, Search } from "lucide-react";
import { useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { ChatView } from "@/components/dashboard/ticketing/chat-view";
import { TicketList } from "@/components/dashboard/ticketing/ticket-list";

export default function TicketingPage() {
  const [selectedTicketId, setSelectedTicketId] = useState("1");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-8">
        <div className="flex-1">
          <CompanyToolbar />
        </div>
        <div className="mb-4 flex w-[350px] items-center">
          <div className="flex items-center gap-4">
            <button className="relative flex cursor-pointer items-center justify-center rounded-3xl bg-white p-4 text-gray-600 shadow-sm transition-colors hover:bg-gray-200">
              <MessageSquare className="h-12 w-12" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                1
              </span>
            </button>

            {/* Search button */}
            <button className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#2196F3] p-4 text-white transition-colors hover:bg-[#1E88E5]">
              <Search className="h-12 w-12" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Left Panel - Ticket List */}
        <div className="w-[320px] shrink-0">
          <TicketList
            selectedTicketId={selectedTicketId}
            onSelectTicket={setSelectedTicketId}
          />
        </div>

        {/* Right Panel - Chat View */}
        <div className="min-w-0 flex-1">
          <ChatView ticketId={selectedTicketId} />
        </div>
      </div>
    </div>
  );
}
