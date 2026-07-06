"use client";

import { Mic, MoreHorizontal, Volume2 } from "lucide-react";

import { useOnboardingStore } from "@/store/onboarding-store";

import { Icons } from "../icons";

export function Phone() {
  const { typedCompanyName } = useOnboardingStore();
  const displayName = typedCompanyName || "Unknown Company";

  return (
    <div className="relative mx-auto h-[600px] w-[310px] overflow-hidden rounded-[40px] border-5 border-gray-900 bg-white shadow-xl">
      <div className="flex h-full flex-col items-center pt-10">
        <div className="absolute mb-8 flex w-full items-start justify-between px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <span className="text-lg text-gray-500">✕</span>
          </div>
        </div>

        <div className="mb-12 space-y-1 text-center">
          <h3 className="text-lg font-semibold text-gray-900 transition-all duration-300">
            {displayName}
          </h3>
          <p className="text-sm text-gray-400">Calling...</p>
        </div>

        <div className="relative flex w-full flex-1 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/aiblock.svg"
            className="h-48 w-48 animate-pulse"
            alt="Phone"
          />
        </div>

        <div className="mb-6 w-full px-6">
          <div className="flex items-center justify-between rounded-[20px] bg-gray-50 px-6 py-2 shadow-[-3px_3px_0px_0px_#000000]">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">
              <Volume2 className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">
              <Mic className="h-5 w-5" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600">
              <Icons.phonedown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
