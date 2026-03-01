"use client";

import Image from "next/image";
import { useState } from "react";

import { AnswerBoundariesStep } from "@/components/dashboard/company-setup/answer-boundaries-step";
import { CompanyIdentityStep } from "@/components/dashboard/company-setup/company-identity-step";
import { CompanyInfoStep } from "@/components/dashboard/company-setup/company-info-step";
import { KnowledgeSourcesStep } from "@/components/dashboard/company-setup/knowledge-sources-step";
import { VoiceConversationStep } from "@/components/dashboard/company-setup/voice-conversation-step";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

const TABS = [
  "Company Information",
  "Company Identity",
  "Knowledge Sources",
  "Answer Boundaries",
  "Voice & Conversation",
];

const TAB_COLORS = [
  "bg-[#6433CC]", // Purple
  "bg-orange-300", // Orange
  "bg-pink-300", // Pink
  "bg-violet-300", // Lavender
  "bg-yellow-100", // Yellow
];

const UpdateButton = () => (
  <button className="w-full cursor-pointer rounded-xl bg-[#006BE5] py-2 text-center font-semibold text-white shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#0058C0]">
    UPDATE
  </button>
);

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex min-h-[450px] flex-col gap-6 rounded-xl bg-white p-4 shadow-sm">
      {/* Need Help Banner */}
      <div className="relative flex h-[150px] items-center justify-between overflow-hidden rounded-2xl bg-[#6433CC] px-8 py-6">
        <Image
          src="/images/box.svg"
          alt=""
          aria-hidden="true"
          width={160}
          height={160}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100"
        />
        <h2 className="font-stolzl font-instrument-sans relative z-10 text-4xl leading-[95%] font-bold tracking-[-2%] text-white">
          Need help?
        </h2>
        <button className="relative z-10 flex items-center gap-2 rounded-md bg-[#2196F3] px-6 py-3 text-sm font-bold text-white shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5]">
          <Icons.CallAgent /> CALL AGENT
        </button>
      </div>

      {/* Tab Bar — matches StepIndicator style */}
      <div className="scrollbar-none overflow-x-auto">
        <div className="flex border-b border-gray-100">
          {TABS.map((tab, index) => {
            const isActive = index === activeTab;
            const barColor = TAB_COLORS[index] ?? "bg-gray-200";
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "relative shrink-0 cursor-pointer px-6 py-4 text-[10px] font-medium tracking-wider uppercase transition-colors",
                  isActive
                    ? "font-bold text-gray-900"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {tab}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 h-1 w-full rounded-t-full",
                    barColor,
                    index > activeTab && "opacity-40",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="scrollbar-none overflow-y-auto p-4">
        {activeTab === 0 && (
          <CompanyInfoStep
            footerAction={<UpdateButton />}
            hideLogoUpload={true}
          />
        )}
        {activeTab === 1 && (
          <CompanyIdentityStep footerAction={<UpdateButton />} />
        )}
        {activeTab === 2 && (
          <KnowledgeSourcesStep footerAction={<UpdateButton />} />
        )}
        {activeTab === 3 && (
          <AnswerBoundariesStep footerAction={<UpdateButton />} />
        )}
        {activeTab === 4 && (
          <VoiceConversationStep footerAction={<UpdateButton />} />
        )}
      </div>
    </div>
  );
}
