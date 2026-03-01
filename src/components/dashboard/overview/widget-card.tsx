"use client";

import { ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

export function WidgetCard() {
  const [isOpen, setIsOpen] = useState(true);

  const codeSnippet = `<script src="https://swiftagents.org/chat-widget.js"></script> <div id="chat-widget"></div> <style>#chat-widget { position: fixed; bottom: 20px; right: 20px; width: 300px; height: 400px; border: 1px solid #ccc; background-color: #fff; z-index: 1000; }</style>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
  };

  return (
    <div className="overflow-hidden rounded-xl">
      {isOpen ? (
        <div className="relative">
          {/* Widget toggle button — overlaps the top-left of the code area */}

          {/* Code snippet with rounded notch in top-left */}
          <div className="relative">
            {/* White cutout that creates the notch — curves via rounded-br */}
            <div className="bg-muted absolute top-0 left-0 z-[1] h-[48px] w-[35%] rounded-br-md">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="font-dm-mono relative z-10 mb-[-20px] flex items-center gap-2 rounded-md bg-[#006BE5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5]"
              >
                <ChevronDown className="h-4 w-4" />
                Widget
              </button>
            </div>

            <div className="rounded-md border border-gray-100 bg-white px-5 pt-16 pb-5 shadow-sm">
              <p className="font-stolzl text-[15px] leading-relaxed text-gray-500">
                &lt;script
                src=&quot;https://swiftagents.org/chat-widget.js&quot;&gt;&lt;/script&gt;
                &lt;div id=&quot;chat-widget&quot;&gt;&lt;/div&gt;
                &lt;style&gt;#chat-widget &#123; position: fixed; bottom: 20px;
                right: 20px; width: 300px; height: 400px; border: 1px solid
                #ccc; background-color: #fff; z-index: 1000;
                &#125;&lt;/style&gt;
              </p>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#006BE5] py-4 text-base font-bold text-white shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-[#1E88E5] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-[-2px_2px_0px_0px_#000000]"
              >
                <Copy className="h-5 w-5" />
                Copy
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5]"
        >
          <ChevronDown className="h-4 w-4 -rotate-90 transition-transform" />
          Widget
        </button>
      )}
    </div>
  );
}
