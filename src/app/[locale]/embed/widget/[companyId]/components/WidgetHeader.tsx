"use client";
import React from "react";

import { Icons } from "@/components/icons";

import { WidgetTab } from "./types";

interface WidgetHeaderProps {
  companyName?: string;
  activeWidgetTab: WidgetTab;
  setActiveWidgetTab: (tab: WidgetTab) => void;
  setIsMinimized: (val: boolean) => void;
}

export function WidgetHeader({
  activeWidgetTab,
  setActiveWidgetTab,
  setIsMinimized,
}: WidgetHeaderProps) {
  return (
    <>
      <button
        onClick={() => setIsMinimized(true)}
        className="animate-float-in absolute top-6 right-6 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition hover:scale-105 sm:top-auto sm:-right-4 sm:-bottom-20"
      >
        <Icons.phoneIncoming className="h-6 w-6 -rotate-90 text-black" />
      </button>

      <div className="flex shrink-0 items-center justify-center gap-1 py-3">
        <div className="flex items-center gap-1 rounded-md bg-[#EDEDED] p-1">
          <button
            onClick={() => setActiveWidgetTab("call")}
            className={`flex items-center gap-1.5 rounded-md px-5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeWidgetTab === "call"
                ? "bg-gray-900 text-white shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            CALL
          </button>
          <button
            onClick={() => setActiveWidgetTab("chat")}
            className={`flex items-center gap-1.5 rounded-md px-5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeWidgetTab === "chat"
                ? "bg-gray-900 text-white shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Chat
          </button>
        </div>
      </div>
    </>
  );
}
