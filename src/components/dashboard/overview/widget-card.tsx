"use client";

import { ChevronDown, Copy, Settings } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useCurrentUser } from "@/hooks/use-auth";

export function WidgetCard() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSticky, setIsSticky] = useState(true);
  const [copied, setCopied] = useState(false);
  const { data: user } = useCurrentUser();

  const companyId = user?.company_id || "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const codeSnippet = useMemo(() => {
    if (!companyId) return "";
    return `<script src="${origin}/widget-ui.js" data-company-id="${companyId}" defer></script>`;
  }, [companyId, origin]);

  const handleCopy = useCallback(() => {
    if (!codeSnippet) return;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeSnippet]);

  return (
    <div className="overflow-hidden rounded-xl">
      {isOpen ? (
        <div className="relative">
          <div className="relative">
            {/* Top bar with notch cutout */}
            <div className="absolute top-0 right-0 left-0 z-1 flex h-[48px] items-center gap-4">
              <div className="bg-muted h-full rounded-br-md pr-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="font-dm-mono flex items-center gap-2 rounded-md bg-[#006BE5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5]"
                >
                  <ChevronDown className="h-4 w-4" />
                  Widget
                </button>
              </div>

              <div className="flex items-center pr-6">
                <button className="font-greed-narrow flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-bold tracking-wider text-gray-600 uppercase transition-colors hover:bg-gray-100">
                  <Settings className="h-3.5 w-3.5" />
                  SETTINGS
                </button>
              </div>
            </div>

            <div className="rounded-md border border-gray-100 bg-white px-5 pt-16 pb-5 shadow-sm">
              {/* Sticky toggle */}
              <div className="mb-4 flex items-center gap-2">
                <figure className="flex w-fit items-center gap-2 rounded-md bg-[#EDEDED] p-1">
                  <button
                    onClick={() => setIsSticky(!isSticky)}
                    className={`font-dm-mono rounded-md px-3 py-1 text-xs font-bold tracking-wider uppercase transition-colors ${
                      isSticky
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isSticky ? "ON" : "OFF"}
                  </button>
                  <span className="font-dm-mono text-sm font-normal text-gray-400">
                    sticky?
                  </span>
                </figure>
                <InfoTooltip text="Toggle to enable/disable the widget on your website." />
              </div>

              {/* Code snippet */}
              <pre className="font-stolzl rounded-lg p-4 text-[13px] leading-relaxed break-all whitespace-pre-wrap text-gray-700">
                {codeSnippet || "No widget code found."}
              </pre>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                disabled={!codeSnippet}
                className="font-dm-mono mt-6 flex w-full items-center justify-center gap-2.5 rounded-md bg-[#006BE5] py-2 text-base font-normal text-white shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-[#1E88E5] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-[-2px_2px_0px_0px_#000000] disabled:opacity-50"
              >
                <Copy className="h-5 w-5" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5]"
        >
          <ChevronDown className="h-4 w-4 -rotate-90 transition-transform" />
          Widget
        </button>
      )}
    </div>
  );
}
