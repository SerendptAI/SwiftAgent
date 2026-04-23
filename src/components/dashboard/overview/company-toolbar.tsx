"use client";

import { ChevronDown } from "lucide-react";

export function CompanyToolbar() {
  return (
    <div className="mb-8 flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
      <button className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs">
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
        Serendpt AI
      </button>
    </div>
  );
}
