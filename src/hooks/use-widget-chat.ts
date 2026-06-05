"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { useUpgradeModalStore } from "@/store/upgrade-modal-store";
import { ChatMsg, NavigationGuide } from "@/types/widget";

const DEFAULT_CHAT_ERROR_TEXT =
  "Sorry, something went wrong. Please try again.";

const DEFAULT_PLAN_LIMIT_TEXT =
  "You've reached your plan limit. Upgrade your plan to keep chatting.";

/** Pull the plan-limit detail out of a 402 response, falling back to a default. */
async function readPlanLimitMessage(res: Response): Promise<string> {
  try {
    const text = await res.text();
    if (!text) return DEFAULT_PLAN_LIMIT_TEXT;
    try {
      const detail = (JSON.parse(text) as { detail?: unknown })?.detail;
      if (typeof detail === "string" && detail.trim()) return detail;
    } catch {
      // Not JSON — fall through and use the raw text if it's meaningful.
    }
    return /payment required/i.test(text) ? DEFAULT_PLAN_LIMIT_TEXT : text;
  } catch {
    return DEFAULT_PLAN_LIMIT_TEXT;
  }
}

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
  /** Send a specific message directly (e.g. hash/ticket ID from the call tab) */
  sendMessage: (text: string) => void;
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

  /** Core send logic — shared by handleSendChat and sendMessage */
  const sendMessageInternal = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isChatLoadingRef.current) return;

      const text = userText.trim();
      const userMsg: ChatMsg = {
        id: Date.now(),
        text,
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
            message: text,
          }),
        });

        if (res.status === 402) {
          // Plan limit reached — pop the upgrade modal and show the reason.
          useUpgradeModalStore.getState().show();
          const limitText = await readPlanLimitMessage(res);
          setChatThinkingText(null);
          setChatMessages((prev) => [
            ...prev,
            {
              id: agentMsgId,
              text: limitText,
              sender: "agent" as const,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
          return;
        }

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
                    m.id === agentMsgId
                      ? { ...m, navigationGuide: navGuide }
                      : m,
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
              } else if (stage === "error") {
                setChatThinkingText(null);
                const errorText =
                  typeof message === "string" && message.trim()
                    ? message
                    : DEFAULT_CHAT_ERROR_TEXT;
                agentText = errorText;
                setChatMessages((prev) =>
                  prev.map((m) =>
                    m.id === agentMsgId ? { ...m, text: errorText } : m,
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
            text: DEFAULT_CHAT_ERROR_TEXT,
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
    },
    [companyId, chatSessionId, scrollToBottom],
  );

  const handleHashSubmit = useCallback(() => {
    if (!hashValue.trim()) return;
    const text = hashValue.trim();
    setHashValue("");
    setShowHashInput(false);
    sendMessageInternal(text);
  }, [hashValue, sendMessageInternal]);

  const handleSendChat = useCallback(() => {
    sendMessageInternal(chatInputRef.current);
  }, [sendMessageInternal]);

  /** Send a specific message programmatically (e.g. from hash input on call tab) */
  const sendMessage = useCallback(
    (text: string) => {
      sendMessageInternal(text);
    },
    [sendMessageInternal],
  );

  return {
    chatMessages,
    chatInput,
    setChatInput,
    isChatLoading,
    chatThinkingText,
    chatEndRef,
    handleSendChat,
    sendMessage,
    showHashInput,
    setShowHashInput,
    hashValue,
    setHashValue,
    handleHashSubmit,
  };
}
