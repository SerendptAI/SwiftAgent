"use client";

import { useState } from "react";

import { AnswerBoundariesStep } from "@/components/dashboard/company-setup/answer-boundaries-step";
import { CompanyIdentityStep } from "@/components/dashboard/company-setup/company-identity-step";
import { CompanyInfoStep } from "@/components/dashboard/company-setup/company-info-step";
import { KnowledgeSourcesStep } from "@/components/dashboard/company-setup/knowledge-sources-step";
import { VoiceConversationStep } from "@/components/dashboard/company-setup/voice-conversation-step";
import { HelpBanner } from "@/components/dashboard/settings/help-banner";
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
      <HelpBanner bgColor="bg-[#6433CC]" />

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
                  "font-dm-mono relative shrink-0 cursor-pointer px-6 py-4 text-[10px] font-medium tracking-wider uppercase transition-colors",
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
