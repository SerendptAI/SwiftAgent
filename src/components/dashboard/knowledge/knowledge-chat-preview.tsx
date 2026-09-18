"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const SUGGESTED_PROMPTS = [
  "What is {COMPANY} about?",
  "How can i use it?",
  "Do you have a starter plan?",
];

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
  const [question, setQuestion] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isActive = question.trim().length > 0 || attachedFile !== null;

  const handleSend = () => {
    if (!isActive) return;
    setQuestion("");
    setAttachedFile(null);
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

      <div className="flex flex-1 flex-col justify-between gap-8 overflow-y-auto px-6 py-6">
        <div className="flex items-start gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/images/newlogo.svg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-[80%] rounded-3xl bg-blue-50 px-4 py-3">
            <p className="text-base leading-6 text-[#006BE5]">
              Hey there! 👋 How can I help you?
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setQuestion(prompt)}
              className="flex cursor-pointer items-center gap-3 rounded-xl text-left text-base text-black"
            >
              <Image
                src="/icons/question.svg"
                alt=""
                width={24}
                height={24}
                className="h-5 w-5 shrink-0"
              />
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0 px-6 pb-6">
        <div className="rounded-[4px] border border-gray-200 p-3">
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
              onChange={(e) => setAttachedFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              aria-label="Send"
              disabled={!isActive}
              onClick={handleSend}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                isActive
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
