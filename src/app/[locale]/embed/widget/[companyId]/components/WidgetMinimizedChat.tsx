"use client";
import { Maximize2 } from "lucide-react";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

import { ChatMsg } from "./types";

interface WidgetMinimizedChatProps {
  companyName?: string;
  chatMessages: ChatMsg[];
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSendChat: () => void;
  isChatLoading?: boolean;
  chatThinkingText?: string | null;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  setIsMinimized: (val: boolean) => void;
}

export function WidgetMinimizedChat({
  companyName,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendChat,
  isChatLoading,
  chatThinkingText,
  chatEndRef,
  setIsMinimized,
}: WidgetMinimizedChatProps) {
  const initial = companyName ? companyName.charAt(0).toUpperCase() : "W";
  const displayName = companyName || "WELLSPRING NETWORKS";

  const now = new Date();
  const timeLabel = now.toLocaleDateString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="pointer-events-none fixed right-0 bottom-0 z-50 flex h-full w-full flex-col items-end justify-end p-4 sm:p-6">
      <style>{`
        @keyframes minimized-chat-in {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-minimized-chat-in {
          animation: minimized-chat-in 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
      `}</style>
      {/* Minimized Chat Card */}
      <div className="animate-minimized-chat-in pointer-events-auto mb-5 flex h-[400px] w-[340px] flex-col rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:w-[380px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6433CC] text-sm font-bold text-white">
              {initial}
            </div>
            <span className="font-dm-mono max-w-[160px] truncate text-xs font-bold tracking-wide text-gray-800 uppercase sm:max-w-[200px]">
              {displayName}
            </span>
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            title="Expand"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Timestamp */}
        <div className="px-4 pb-2 text-center">
          <span className="text-[11px] text-gray-400">{timeLabel}</span>
        </div>

        {/* Messages */}
        <div className="scrollbar-none flex h-[280px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-2">
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
                  "max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed",
                  msg.sender === "user"
                    ? "rounded-2xl rounded-tr-sm bg-[#f6f6f5] text-gray-900"
                    : "rounded-2xl rounded-tl-sm bg-[#f0f7ff] text-[#1a73e8]",
                )}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          {chatThinkingText && (
            <div className="flex w-full justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-[#f0f7ff] px-4 py-3">
                <span className="h-1.5 w-1.5 animate-[bounce_1.2s_ease-in-out_infinite] rounded-full bg-[#1a73e8]/50" />
                <span className="h-1.5 w-1.5 animate-[bounce_1.2s_ease-in-out_0.2s_infinite] rounded-full bg-[#1a73e8]/50" />
                <span className="h-1.5 w-1.5 animate-[bounce_1.2s_ease-in-out_0.4s_infinite] rounded-full bg-[#1a73e8]/50" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-1 w-full" />
        </div>

        {/* Input */}
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 rounded-full bg-[#f6f6f5] px-2 py-1.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Write here..."
              className="font-dm-mono flex-1 bg-transparent px-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim() || isChatLoading}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
            >
              {isChatLoading ? "..." : "Send"}
              <Icons.sendIcon className="h-3.5 w-3.5 fill-white text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Restore Button */}
      <button
        onClick={() => setIsMinimized(false)}
        className="animate-float-in pointer-events-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 sm:h-[72px] sm:w-[72px]"
        title="Expand Call"
      >
        <Icons.phoneIncoming className="h-7 w-7 animate-pulse text-black sm:h-8 sm:w-8" />
      </button>
    </div>
  );
}
