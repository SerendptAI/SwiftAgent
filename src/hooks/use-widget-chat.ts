"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import {
  ChatMsg,
  NavigationGuide,
} from "@/app/[locale]/embed/widget/[companyId]/components/types";

interface UseWidgetChatOptions {
  companyId: string;
}

interface UseWidgetChatReturn {
  chatMessages: ChatMsg[];
  chatInput: string;
  setChatInput: (val: string) => void;
  isChatLoading: boolean;
  chatThinkingText: string | null;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  handleSendChat: () => void;
  showHashInput: boolean;
  setShowHashInput: React.Dispatch<React.SetStateAction<boolean>>;
  hashValue: string;
  setHashValue: (val: string) => void;
  handleHashSubmit: () => void;
}

/**
 * Manages all chat-related state and logic:
 * - Message list with SSE streaming
 * - Chat input
 * - Hash/ticket ID input
 * - Loading / thinking indicators
 */
export function useWidgetChat({
  companyId,
}: UseWidgetChatOptions): UseWidgetChatReturn {
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: 1,
      text: "Hello! How can I assist you today?",
      sender: "agent",
      time: "",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatThinkingText, setChatThinkingText] = useState<string | null>(null);
  const [showHashInput, setShowHashInput] = useState(false);
  const [hashValue, setHashValue] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatSessionId = useMemo(() => crypto.randomUUID(), []);

  // Use a ref for chatInput so handleSendChat doesn't recreate on every keystroke
  const chatInputRef = useRef(chatInput);
  chatInputRef.current = chatInput;
  const isChatLoadingRef = useRef(isChatLoading);
  isChatLoadingRef.current = isChatLoading;

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleHashSubmit = useCallback(() => {
    if (!hashValue.trim()) return;
    const msg: ChatMsg = {
      id: Date.now(),
      text: hashValue.trim(),
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, msg]);
    setHashValue("");
  }, [hashValue]);

  const handleSendChat = useCallback(async () => {
    const currentInput = chatInputRef.current;
    if (!currentInput.trim() || isChatLoadingRef.current) return;

    const userText = currentInput.trim();
    const userMsg: ChatMsg = {
      id: Date.now(),
      text: userText,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);
    setTimeout(scrollToBottom, 50);

    const agentMsgId = Date.now() + 1;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          session_id: chatSessionId,
          message: userText,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Chat request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let agentText = "";
      let buffer = "";
      let navGuide: NavigationGuide | undefined;

      // Add placeholder agent message
      setChatMessages((prev) => [
        ...prev,
        { id: agentMsgId, text: "", sender: "agent", time: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const dataLine = event
            .split("\n")
            .find((l) => l.startsWith("data: "));
          if (!dataLine) continue;

          try {
            const parsed = JSON.parse(dataLine.slice(6));
            const stage = parsed?.data?.stage;
            const message = parsed?.data?.message;

            if (stage === "thinking" && typeof message === "string") {
              setChatThinkingText(message);
              scrollToBottom();
            } else if (stage === "tool") {
              const label = parsed?.data?.label;
              if (typeof label === "string") {
                setChatThinkingText(label);
                scrollToBottom();
              }
            } else if (stage === "navigation_guide") {
              setChatThinkingText(null);
              navGuide = {
                steps: parsed?.data?.steps ?? [],
                path_summary: parsed?.data?.path_summary ?? [],
              };
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === agentMsgId ? { ...m, navigationGuide: navGuide } : m,
                ),
              );
              scrollToBottom();
            } else if (stage === "stream" && typeof message === "string") {
              setChatThinkingText(null);
              agentText += message;
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === agentMsgId ? { ...m, text: agentText } : m,
                ),
              );
              scrollToBottom();
            }
          } catch {
            // Skip malformed data
          }
        }
      }

      // Set final timestamp
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsgId
            ? {
                ...m,
                text: agentText || "Sorry, I couldn't generate a response.",
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : m,
        ),
      );
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages((prev) => [
        ...prev.filter((m) => m.id !== agentMsgId),
        {
          id: agentMsgId,
          text: "Sorry, something went wrong. Please try again.",
          sender: "agent" as const,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
      setChatThinkingText(null);
    }
  }, [companyId, chatSessionId, scrollToBottom]);

  return {
    chatMessages,
    chatInput,
    setChatInput,
    isChatLoading,
    chatThinkingText,
    chatEndRef,
    handleSendChat,
    showHashInput,
    setShowHashInput,
    hashValue,
    setHashValue,
    handleHashSubmit,
  };
}
