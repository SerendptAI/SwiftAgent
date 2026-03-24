"use client";

import { useCallback, useState } from "react";

import { Loader } from "@/components/loader";
import { CountryFlag } from "@/components/ui/country-flag";
import { useDashboardVisitors } from "@/hooks/use-dashboard";
import { formatDate, formatDuration } from "@/lib/format";
import { DashboardVisitor } from "@/services/dashboard";

import { VisitorsModal } from "./visitors-modal";

export function VisitorRow({
  visitor,
  size = "sm",
}: {
  visitor: DashboardVisitor;
  size?: "sm" | "lg";
}) {
  const textClass =
    size === "lg"
      ? "text-sm font-bold text-gray-900"
      : "text-xs font-bold text-gray-900";

  return (
    <tr className="group">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <CountryFlag code={visitor.country_code} />
          <span className={textClass}>
            {visitor.visitor_id.length > 8
              ? `${visitor.visitor_id.substring(0, 4)}...`
              : visitor.visitor_id}
          </span>
        </div>
      </td>
      <td className={`py-3 ${textClass}`}>
        {formatDuration(visitor.duration_seconds)}
      </td>
      <td className={`py-3 text-right ${textClass}`}>
        {formatDate(visitor.timestamp)}
      </td>
    </tr>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function VisitorsList({
  initialData,
}: {
  initialData?: DashboardVisitor[];
}) {
  const { data: visitors, isLoading } = useDashboardVisitors(20, initialData);
  const [showModal, setShowModal] = useState(false);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <>
      <div className="flex max-h-[350px] flex-col rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-stolzl text-lg font-normal text-gray-900">
            Visitors
          </h3>
          {visitors && visitors.length > 0 && (
            <button
              onClick={openModal}
              className="font-greed-narrow cursor-pointer rounded-md bg-[#F7F7F7] px-4 py-2 text-base font-bold tracking-wider text-gray-900 uppercase transition-colors hover:bg-gray-50"
            >
              SEE ALL
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
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
                <tr className="font-dm-mono border-b border-gray-100 text-base text-gray-500">
                  <th className="pb-3 font-normal">Visitor</th>
                  <th className="pb-3 font-normal">Duration</th>
                  <th className="pb-3 text-right font-normal">Time/Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitors.map((visitor) => (
                  <VisitorRow key={visitor.id} visitor={visitor} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && visitors && (
        <VisitorsModal visitors={visitors} onClose={closeModal} />
      )}
    </>
  );
}
