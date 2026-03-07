"use client";

import { ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

import { Loader } from "@/components/loader";
import { useCurrentUser } from "@/hooks/use-auth";
import { useDashboardWidget } from "@/hooks/use-dashboard";
import { DashboardWidget } from "@/services/dashboard";

export function WidgetCard({
  initialData,
}: {
  initialData?: DashboardWidget | null;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const { data: user } = useCurrentUser();
  const { data: widgetData, isLoading } = useDashboardWidget(initialData);

  const companyId = widgetData?.company_id || user?.company_id || "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const codeSnippet = companyId
    ? `<script src="${origin}/widget.js" data-company-id="${companyId}" defer></script>`
    : "";

  const handleCopy = () => {
    if (codeSnippet) {
      navigator.clipboard.writeText(codeSnippet);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl">
      {isOpen ? (
        <div className="relative">
          {/* Widget toggle button — overlaps the top-left of the code area */}

          {/* Code snippet with rounded notch in top-left */}
          <div className="relative">
            {/* White cutout that creates the notch — curves via rounded-br */}
            <div className="bg-muted absolute top-0 left-0 z-1 h-[48px] w-[35%] rounded-br-md">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="font-dm-mono relative z-10 mb-[-20px] flex items-center gap-2 rounded-md bg-[#006BE5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5]"
              >
                <ChevronDown className="h-4 w-4" />
                Widget
              </button>
            </div>

            <div className="rounded-md border border-gray-100 bg-white px-5 pt-16 pb-5 shadow-sm">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : (
                <>
                  <pre className="font-dm-mono rounded-lg p-4 text-[13px] leading-relaxed break-all whitespace-pre-wrap text-gray-700">
                    {codeSnippet ? codeSnippet : "No widget code found."}
                  </pre>

                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    disabled={!codeSnippet}
                    className="font-dm-mono mt-6 flex w-full items-center justify-center gap-2.5 rounded-md bg-[#006BE5] py-2 text-base font-normal text-white shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-[#1E88E5] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-[-2px_2px_0px_0px_#000000] disabled:opacity-50"
                  >
                    <Copy className="h-5 w-5" />
                    Copy
                  </button>
                </>
              )}
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
