"use client";

import { ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function WidgetCard() {
  const [isOpen, setIsOpen] = useState(true);

  const codeSnippet = `<script src="https://swiftagents.org/chat-widget.js"></script> <div id="chat-widget"></div> <style>#chat-widget { position: fixed; bottom: 20px; right: 20px; width: 300px; height: 400px; border: 1px solid #ccc; background-color: #fff; z-index: 1000; }</style>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white p-5 shadow-sm">
      {/* Widget toggle button */}
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5]"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              !isOpen && "-rotate-90",
            )}
          />
          Widget
        </button>
      </div>

      {isOpen && (
        <>
          {/* Code snippetxsrea */}
          <div className="mb-6 rounded-2xl bg-[#F5F7FA] px-5 py-5">
            <p className="text-[15px] leading-relaxed text-gray-500">
              &lt;script
              src=&quot;https://swiftagents.org/chat-widget.js&quot;&gt;&lt;/script&gt;
              &lt;div id=&quot;chat-widget&quot;&gt;&lt;/div&gt;
              &lt;style&gt;#chat-widget &#123; position: fixed; bottom: 20px;
              right: 20px; width: 300px; height: 400px; border: 1px solid #ccc;
              background-color: #fff; z-index: 1000; &#125;&lt;/style&gt;
            </p>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#2196F3] py-4 text-base font-bold text-white shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-[#1E88E5] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-[-2px_2px_0px_0px_#000000]"
          >
            <Copy className="h-5 w-5" />
            Copy
          </button>
        </>
      )}
    </div>
  );
}
