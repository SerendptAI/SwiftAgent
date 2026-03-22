"use client";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

import { ChatMsg } from "./types";

interface WidgetChatTabProps {
  companyName?: string;
  chatMessages: ChatMsg[];
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSendChat: () => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export function WidgetChatTab({
  companyName,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendChat,
  chatEndRef,
}: WidgetChatTabProps) {
  return (
    <div className="pointer-events-auto absolute inset-0 top-[60px] z-20 flex w-full flex-col rounded-b-3xl bg-white sm:rounded-b-4xl">
      {/* Chat Header */}
      <div className="shrink-0 border-b border-gray-100 bg-white px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-900">{companyName}</h3>
        <p className="text-xs text-gray-400">Chat support</p>
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
