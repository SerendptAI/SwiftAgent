import { useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

import { TICKETS } from "./ticket-list";

interface Message {
  id: string;
  type: "agent" | "user" | "system";
  content: string;
  time?: string;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      type: "agent",
      content: "Hey there! 👋 How can I help you?",
      time: "Wed 8:21 AM",
    },
    {
      id: "2",
      type: "user",
      content: "I'd like to schedule a gym appointment",
    },
    {
      id: "3",
      type: "agent",
      content:
        "Great, can we get your email so we email the options available to you?",
    },
    {
      id: "4",
      type: "user",
      content: "dab@serendptai.com",
    },
    {
      id: "5",
      type: "agent",
      content: "We'll email you the options available to...",
    },
  ],
  "2": [
    {
      id: "1",
      type: "agent",
      content: "Hello! Looking for something specific?",
      time: "Wed 4:11 PM",
    },
  ],
  "3": [
    {
      id: "1",
      type: "agent",
      content: "Hi there, how can I assist you today?",
      time: "Wed 4:10 PM",
    },
  ],
};

interface ChatViewProps {
  ticketId: string;
}

export function ChatView({ ticketId }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedTicket = TICKETS.find((t) => t.id === ticketId);

  useEffect(() => {
    // Load initial messages for the selected ticket
    setMessages(INITIAL_MESSAGES[ticketId] || []);
  }, [ticketId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    // Simulate network delay
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: inputValue,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      setIsSending(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F25430]/10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-[#F25430]"
          >
            <path
              d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z"
              fill="currentColor"
            />
            <path
              d="M10 12C6.13401 12 3 14.2386 3 17C3 17.5523 3.44772 18 4 18H16C16.5523 18 17 17.5523 17 17C17 14.2386 13.866 12 10 12Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-sm font-bold text-gray-900">
          {selectedTicket?.visitorId || "Unknown Visitor"}
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.length > 0 && messages[0].time && (
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400">{messages[0].time}</span>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.type === "agent" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                message.type === "agent"
                  ? "bg-[#2196F3] text-white"
                  : "bg-gray-100 text-gray-900",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="border-t border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          <div className="flex flex-1 items-center gap-2 px-2">
            <span className="shrink-0 text-sm font-medium text-gray-900">
              Send gym appointment option to
            </span>
            <span className="rounded-lg bg-[#F0F7FF] px-3 py-1.5 text-sm font-medium text-[#006BE5]">
              {selectedTicket?.visitorId === "V1GSHST-TAR6282"
                ? "dab@serendptai.com"
                : "visitor@example.com"}
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="ml-2 flex-1 text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 rounded-lg bg-[#F5F5F5] px-3 py-1.5 text-sm font-medium text-gray-500">
              <div className="relative flex h-5 w-5 items-center justify-center">
                <div className="absolute h-full w-full rounded-full border-2 border-[#F25430]" />
                <div className="absolute h-full w-full rounded-full border-2 border-transparent border-t-white" />
              </div>
              Gym appointment details found
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isSending}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all active:scale-95",
                isSending
                  ? "bg-[#006BE5]/70"
                  : "bg-[#006BE5] hover:bg-[#005bb8]",
              )}
            >
              <Icons.sendIcon className="h-4 w-4" />
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
