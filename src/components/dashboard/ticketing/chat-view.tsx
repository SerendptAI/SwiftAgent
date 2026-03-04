import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { Loader } from "@/components/loader";
import { useConversation } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

interface LocalMessage {
  id: string;
  type: "agent" | "user" | "system";
  content: string;
  time?: string;
}

interface ChatViewProps {
  ticketId: string;
}

export function ChatView({ ticketId }: ChatViewProps) {
  const { data: conversation, isLoading } = useConversation(ticketId);

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync API messages to local state so we can append UI optimistic messages
  useEffect(() => {
    if (conversation?.messages) {
      const formattedMessages: LocalMessage[] = conversation.messages.map((msg, i) => {
        let displayTime = "";
        try {
          if (msg.timestamp) {
            displayTime = format(new Date(msg.timestamp), "EEE h:mm a");
          }
        } catch {
          // ignore parsing error
        }

        return {
          id: `${conversation.id}-${i}`,
          type: (msg.role as "agent" | "user" | "system") || "user",
          content: msg.content,
          time: displayTime,
        };
      });
      setMessages(formattedMessages);
    } else {
      setMessages([]);
    }
  }, [conversation]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    // Simulate network delay for replying since we only have a create endpoint
    setTimeout(() => {
      const newMessage: LocalMessage = {
        id: Date.now().toString(),
        type: "agent",
        content: inputValue,
        time: format(new Date(), "h:mm a"),
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

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white shadow-sm">
        <Loader />
      </div>
    );
  }

  if (!conversation && !isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white shadow-sm text-gray-500">
        Select a conversation to view messages.
      </div>
    );
  }

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
        <span className="font-dm-mono text-sm font-bold text-gray-900">
          {conversation?.user_id || "Unknown Visitor"}
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
              {conversation?.user_id || "visitor@example.com"}
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
            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isSending || !conversation}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all active:scale-95",
                isSending || !conversation
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
