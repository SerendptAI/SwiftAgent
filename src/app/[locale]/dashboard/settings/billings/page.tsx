import { ChevronDown } from "lucide-react";

import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { Icons } from "@/components/icons";

const SAVED_CARD = { label: "SAVED CARDS", last4: "7832-4563" };
const PRESENT_PLAN = { label: "PRESENT PLAN", name: "YELLOW PILL" };

export default function BillingsPage() {
  return (
    <div className="flex min-h-[450px] flex-col gap-6 rounded-xl bg-white p-4 shadow-sm">
      <HelpBanner bgColor="bg-[#F2B035]" textColor="text-white" />

      {/* Billing Details */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-lg font-bold text-gray-900">
          Billing details
        </h3>

        {/* Saved Cards */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            {SAVED_CARD.label}
          </span>
          <button className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-2.5">
            <Icons.mastercard />
            <span className="font-dm-mono text-sm font-medium text-gray-700">
              {SAVED_CARD.last4}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Present Plan */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            {PRESENT_PLAN.label}
          </span>
          <button className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-2.5">
            <div className="h-4 w-4 rounded-full bg-[#F2B035]" />
            <span className="font-dm-mono text-sm font-medium tracking-wide text-gray-700 uppercase">
              {PRESENT_PLAN.name}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
