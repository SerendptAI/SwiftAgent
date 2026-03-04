"use client";

import { Loader } from "@/components/loader";
import { useDashboardVisitors } from "@/hooks/use-dashboard";

function formatDuration(seconds: number): string {
  if (!seconds) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatDate(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric"
  });
}

function CountryFlag({ code }: { code: string }) {
  // A simple fallback for flags, could be replaced with a proper icon library later
  if (code?.toLowerCase() === "ng") {
    return (
      <div className="relative flex h-5 w-7 shrink-0 flex-col overflow-hidden rounded-sm shadow-sm">
        <div className="h-1/3 w-full bg-[#008751]"></div>
        <div className="h-1/3 w-full bg-white"></div>
        <div className="h-1/3 w-full bg-[#008751]"></div>
      </div>
    );
  }

  // Generic fallback flag
  return (
    <div className="flex h-5 w-7 shrink-0 items-center justify-center rounded-sm bg-gray-100 shadow-sm text-[10px] font-bold uppercase text-gray-500">
      {code}
    </div>
  );
}

export function VisitorsList() {
  const { data: visitors, isLoading } = useDashboardVisitors();

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-900">Visitors</h3>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader />
          </div>
        ) : !visitors || visitors.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-500">
            No visitors found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="pb-3 font-normal">Visitor</th>
                <th className="pb-3 font-normal">Duration</th>
                <th className="pb-3 text-right font-normal">Time/Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="group">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <CountryFlag code={visitor.country_code} />
                      <span className="text-xs font-bold text-gray-900">
                        {visitor.visitor_id.length > 8
                          ? `${visitor.visitor_id.substring(0, 4)}...`
                          : visitor.visitor_id}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-xs font-bold text-gray-900">
                    {formatDuration(visitor.duration_seconds)}
                  </td>
                  <td className="py-3 text-right text-xs font-bold text-gray-900">
                    {formatDate(visitor.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
