"use client";

import { ChevronDown, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useCompanyQuery } from "@/hooks/use-company";
import { useQueryKnowledge, useUploadKnowledge } from "@/hooks/use-knowledge";
import { getApiErrorMessage } from "@/lib/api-error";
import type { KnowledgeSearchResult } from "@/services/knowledge";

const SUGGESTED_PROMPTS = [
  "What is {COMPANY} about?",
  "How can i use it?",
  "Do you have a starter plan?",
];

type ChatMessage =
  | { id: number; role: "user"; text?: string; fileName?: string }
  | { id: number; role: "agent"; kind: "text"; text: string }
  | {
      id: number;
      role: "agent";
      kind: "results";
      results: KnowledgeSearchResult[];
      escalate: boolean;
    };

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

let nextMessageId = 0;

function AgentAvatar() {
  return (
    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
      <Image src="/images/newlogo.svg" alt="" fill className="object-cover" />
    </div>
  );
}

function AgentBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[80%] rounded-3xl bg-blue-50 px-4 py-3">
      <p className="text-base leading-6 text-[#006BE5]">{children}</p>
    </div>
  );
}

function ResultCard({ result }: { result: KnowledgeSearchResult }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-medium text-black">
          {result.title}
        </p>
        <span className="shrink-0 rounded-full bg-[#EDEDED] px-2 py-0.5 text-xs text-black/60">
          {Math.round(result.score * 100)}% match
        </span>
      </div>
      <p className="mt-1 line-clamp-3 text-sm text-black/70">
        {result.content}
      </p>
    </div>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1">
        {message.fileName && (
          <div className="max-w-[80%] truncate rounded-3xl bg-[#006BE5]/10 px-4 py-2 text-sm text-[#006BE5]">
            {message.fileName}
          </div>
        )}
        {message.text && (
          <div className="max-w-[80%] rounded-3xl bg-[#006BE5] px-4 py-3 text-base leading-6 text-white">
            {message.text}
          </div>
        )}
      </div>
    );
  }

  if (message.kind === "text") {
    return (
      <div className="flex items-start gap-3">
        <AgentAvatar />
        <AgentBubble>{message.text}</AgentBubble>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <AgentAvatar />
      <div className="flex max-w-[80%] min-w-0 flex-col gap-3">
        <AgentBubble>
          {message.escalate
            ? "I'm not fully confident about this. These are the closest matches in your knowledge base:"
            : "Here's what I found in your knowledge base:"}
        </AgentBubble>
        {message.results.map((result, index) => (
          <ResultCard key={`${result.title}-${index}`} result={result} />
        ))}
      </div>
    </div>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.50509 6.26749C5.62927 2.07554 6.69133 -0.0204025 8.38294 0.000149681C10.0745 0.0207672 11.0853 2.14197 13.1068 6.38431L14.4834 9.27332C16.036 12.5314 16.8123 14.1605 16.224 14.932C16.0659 15.1394 15.8588 15.3097 15.6188 15.4293C14.7263 15.8744 13.1092 14.9362 9.87512 13.0598C9.15777 12.6436 8.79907 12.4354 8.40446 12.3942C8.28997 12.3822 8.17456 12.3808 8.05981 12.39C7.66432 12.4216 7.30066 12.621 6.57343 13.0196C3.29457 14.8167 1.65514 15.7153 0.773717 15.2487C0.536738 15.1232 0.3338 14.948 0.18076 14.7368C-0.388474 13.9512 0.427207 12.3415 2.05856 9.12211L3.50509 6.26749Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function KnowledgeChatPreview() {
  const companyId = useActiveCompanyId();
  const { data: company } = useCompanyQuery(companyId);
  const queryKnowledge = useQueryKnowledge();
  const uploadKnowledge = useUploadKnowledge();
  const [question, setQuestion] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isActive = question.trim().length > 0 || attachedFile !== null;
  const canSend = isActive && !isBusy && !!companyId;
  const companyName = company?.name ?? "your company";

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isBusy]);

  const addMessage = (message: DistributiveOmit<ChatMessage, "id">) =>
    setMessages((prev) => [
      ...prev,
      { ...message, id: nextMessageId++ } as ChatMessage,
    ]);

  const addAgentText = (text: string) =>
    addMessage({ role: "agent", kind: "text", text });

  const handleSend = async () => {
    if (!canSend || !companyId) return;

    const text = question.trim();
    const file = attachedFile;
    setQuestion("");
    setAttachedFile(null);
    addMessage({
      role: "user",
      text: text || undefined,
      fileName: file?.name,
    });
    setIsBusy(true);

    if (file) {
      try {
        await uploadKnowledge.mutateAsync({
          companyId,
          category: "general",
          file,
        });
        addAgentText(`I've added ${file.name} to your knowledge base.`);
      } catch (error) {
        addAgentText(
          getApiErrorMessage(
            error,
            `I couldn't upload ${file.name}. Please try again.`,
          ),
        );
      }
    }

    if (text) {
      try {
        const response = await queryKnowledge.mutateAsync({
          query: text,
          company_id: companyId,
        });
        if (response.results.length === 0) {
          addAgentText(
            "I couldn't find anything about that in your knowledge base yet.",
          );
        } else {
          addMessage({
            role: "agent",
            kind: "results",
            results: response.results,
            escalate: response.escalate,
          });
        }
      } catch (error) {
        addAgentText(
          getApiErrorMessage(
            error,
            "I couldn't search your knowledge base. Please try again.",
          ),
        );
      }
    }

    setIsBusy(false);
  };

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-3xl bg-white shadow-sm lg:min-h-0">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image src="/images/newlogo.svg" alt="" width={48} height={48} />
          <span className="truncate text-lg font-medium tracking-[2%] text-black">
            Swift Agents
          </span>
        </div>
        <ChevronDown className="h-7 w-7 shrink-0 text-black" />
      </div>

      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6"
      >
        <div className="flex items-start gap-3">
          <AgentAvatar />
          <AgentBubble>Hey there! 👋 How can I help you?</AgentBubble>
        </div>

        {messages.map((message) => (
          <MessageRow key={message.id} message={message} />
        ))}

        {isBusy && (
          <div className="flex items-center gap-3">
            <AgentAvatar />
            <Loader2 className="h-5 w-5 animate-spin text-[#006BE5]" />
          </div>
        )}

        {messages.length === 0 && (
          <div className="mt-auto flex flex-col gap-4">
            {SUGGESTED_PROMPTS.map((prompt) => {
              const label = prompt.replace("{COMPANY}", companyName);
              return (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setQuestion(label)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl text-left text-base text-black"
                >
                  <Image
                    src="/icons/question.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="h-5 w-5 shrink-0"
                  />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 px-6 pb-6">
        <div className="rounded-[4px] border border-gray-200 p-3">
          {attachedFile && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#EDEDED] px-3 py-2 text-sm text-black">
              <span className="min-w-0 flex-1 truncate">
                {attachedFile.name}
              </span>
              <button
                type="button"
                aria-label="Remove attached file"
                onClick={() => setAttachedFile(null)}
                className="shrink-0 cursor-pointer text-black/60 transition-colors hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Ask a question"
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
          />
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Attach a file"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 cursor-pointer transition-opacity hover:opacity-70"
            >
              <Image src="/icons/file.svg" alt="" width={20} height={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                setAttachedFile(e.target.files?.[0] ?? null);
                // Reset so re-selecting the same file still fires onChange
                e.target.value = "";
              }}
            />
            <button
              type="button"
              aria-label="Send"
              disabled={!canSend}
              onClick={handleSend}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                canSend
                  ? "cursor-pointer bg-[#006BE5] text-white hover:bg-[#005fca]"
                  : "cursor-not-allowed bg-[#F6F6F6] text-[#7E7E7E]"
              }`}
            >
              <SendIcon className="flex h-6.5 w-6.5 items-center justify-center" />
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs tracking-[2%] text-gray-400 uppercase">
          Powered by swiftagents.org
        </p>
      </div>
    </div>
  );
}
