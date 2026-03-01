import { ChevronDown } from "lucide-react";

import { HelpBanner } from "@/components/dashboard/settings/help-banner";

export default function NotificationsPage() {
  return (
    <div className="flex min-h-[450px] flex-col gap-6 rounded-xl bg-white p-4 shadow-sm">
      <HelpBanner bgColor="bg-[#7F9FFF]" />

      {/* Set a Back-up email */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-lg font-bold text-gray-900">
          Set a Back-up email
        </h3>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            Back-up Email
          </span>
          <button className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-2.5">
            <span className="font-dm-mono text-sm font-medium tracking-wide text-gray-700 uppercase">
              Add New Email
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            Access Code
          </span>
          <div className="rounded-2xl border border-gray-100 px-4 py-2.5">
            <span className="font-dm-mono text-sm font-medium tracking-wider text-gray-700">
              ************
            </span>
          </div>
        </div>
      </div>

      {/* Add a new member */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-lg font-bold text-gray-900">
          Add a new member
        </h3>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            Add Member
          </span>
          <button className="rounded-2xl bg-[#006BE5] px-6 py-2.5 text-sm font-bold tracking-wide text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#0058C0]">
            Add Email
          </button>
        </div>
      </div>
    </div>
  );
}
