"use client";

import { ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function WidgetCard() {
  const [isOpen, setIsOpen] = useState(true);

  const codeSnippet = `<script src="https://swiftagents.org/chat-widget.js"></script> <div id="chat-widget"></div> <style>#chat-widget { position: fixed; bottom: 20px; right: 20px; width: 300px; height: 400px; border: 1px solid #ccc; background-color: #fff; z-index: 1000; }</style>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    // You could add a toast notification here
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg bg-[#6433CC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
          Widget
        </button>
      </div>

      {isOpen && (
        <>
          <div className="mb-4 text-xs text-gray-400">
            &lt;script
            src=&quot;https://swiftagents.org/chat-widget.js&quot;&gt;&lt;/script&gt;
            &lt;div id=&quot;chat-widget&quot;&gt;&lt;/div&gt;
            &lt;style&gt;#chat-widget &#123; position: fixed; bottom: 20px;
            right: 20px; width: 300px; height: 400px; border: 1px solid #ccc;
            background-color: #fff; z-index: 1000; &#125;&lt;/style&gt;
          </div>

          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6433CC] py-3 text-sm font-bold text-white shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-purple-700"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </>
      )}
    </div>
  );
}
