"use client";

import { ArrowUp, ChevronDown, Paperclip } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const SUGGESTED_PROMPTS = [
  "What is {COMPANY} about?",
  "How can i use it?",
  "Do you have a starter plan?",
];

export function KnowledgeChatPreview() {
  const [question, setQuestion] = useState("");

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image src="/images/newlogo.svg" alt="" width={34} height={34} />
          <span className="truncate text-sm font-semibold tracking-widest text-black uppercase">
            Swift Agents
          </span>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-black/60" />
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2B035]">
            <div className="relative h-4 w-4">
              <Image
                src="/images/mask.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="max-w-[80%] rounded-3xl bg-blue-50 px-4 py-2.5">
            <p className="text-sm leading-6 text-[#006BE5]">
              Hey there! 👋 How can I help you?
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setQuestion(prompt)}
              className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-black/70 transition-colors hover:bg-gray-50"
            >
              <span className="text-black/40">?</span>
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5">
          <button
            type="button"
            className="shrink-0 cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setQuestion("");
            }}
            placeholder="Ask a question"
            className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            aria-label="Send"
            onClick={() => setQuestion("")}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] tracking-wide text-gray-400">
          Powered by swiftagents.org
        </p>
      </div>
    </div>
  );
}
