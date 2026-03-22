"use client";
import { Minimize2 } from "lucide-react";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

import { ChatMsg, WidgetTab } from "./types";

interface WidgetChatTabProps {
  companyName?: string;
  chatMessages: ChatMsg[];
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSendChat: () => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  setActiveWidgetTab: (tab: WidgetTab) => void;
  setIsMinimized: (val: boolean) => void;
}

export function WidgetChatTab({
  companyName,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendChat,
  chatEndRef,
  setActiveWidgetTab,
  setIsMinimized,
}: WidgetChatTabProps) {
  const initial = companyName ? companyName.charAt(0).toUpperCase() : "W";
  const displayName = companyName || "WELLSPRING NETWORKS SWIFT AGENTS";

  return (
    <div className="pointer-events-auto relative z-20 flex h-full w-full flex-col rounded-3xl bg-white sm:h-[600px] sm:max-h-[calc(100vh-100px)] sm:rounded-4xl">
      {/* Custom Chat Header from mock */}
      <div className="flex shrink-0 items-center justify-between rounded-t-3xl border-b border-gray-100 bg-white px-4 py-3 sm:rounded-t-4xl sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6433CC] text-sm font-bold text-white sm:h-10 sm:w-10">
            {initial}
          </div>
          <span className="font-dm-mono text-xs font-bold tracking-wide text-gray-800 uppercase sm:text-sm">
            {displayName}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setActiveWidgetTab("call")}
            className="rounded-full px-4 py-1.5 text-xs font-semibold text-gray-500 transition-all duration-200 hover:text-gray-700"
          >
            Call
          </button>
          <button
            onClick={() => setActiveWidgetTab("chat")}
            className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200"
          >
            CHAT
          </button>
        </div>

        <button
          onClick={() => setIsMinimized(true)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <Minimize2 className="h-4 w-4" />
        </button>
      </div>

      <div className="scrollbar-none flex-1 space-y-6 overflow-y-auto bg-white px-4 py-6 sm:px-8 sm:py-8">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              msg.sender === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] px-5 py-3 text-[14px] leading-relaxed sm:max-w-[75%] sm:text-[15px]",
                msg.sender === "user"
                  ? "rounded-3xl rounded-tr-md bg-[#f6f6f5] text-gray-900"
                  : "rounded-3xl rounded-tl-md bg-[#f0f7ff] text-[#1a73e8]",
              )}
            >
              <p>{msg.text}</p>
              {msg.time && (
                <p className="mt-1 text-right text-[10px] opacity-50">
                  {msg.time}
                </p>
              )}
            </div>
          </div>
        ))}
        {/* We need a little padding at the bottom so the last message isn't flush */}
        <div ref={chatEndRef} className="h-2 w-full" />
      </div>

      <div className="shrink-0 rounded-b-3xl bg-white px-4 py-4 sm:rounded-b-4xl sm:px-8 sm:py-6">
        <div className="flex items-center gap-3 rounded-full bg-[#f6f6f5] px-2 py-2 sm:px-3 sm:py-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            placeholder="Write here..."
            className="font-dm-mono flex-1 bg-transparent px-4 text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
          <button
            onClick={handleSendChat}
            disabled={!chatInput.trim()}
            className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            Send
            <Icons.sendIcon className="h-4 w-4 fill-white text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
