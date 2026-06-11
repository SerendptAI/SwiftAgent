"use client";

import { useState } from "react";

import { AnswerBoundariesStep } from "@/components/dashboard/company-setup/answer-boundaries-step";
import { CompanyIdentityStep } from "@/components/dashboard/company-setup/company-identity-step";
import { CompanyInfoStep } from "@/components/dashboard/company-setup/company-info-step";
import { KnowledgeSourcesStep } from "@/components/dashboard/company-setup/knowledge-sources-step";
import { VoiceConversationStep } from "@/components/dashboard/company-setup/voice-conversation-step";
import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { useActiveCompanyId } from "@/hooks/use-active-company";
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

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState(0);
  const companyId = useActiveCompanyId();

  return (
    <div className="scrollbar-none flex min-h-[360px] w-full max-w-4xl min-w-0 flex-col gap-5 overflow-x-hidden overflow-y-auto rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4">
      <HelpBanner bgColor="bg-[#6433CC]" />

      {/* Tab Bar — matches StepIndicator style */}
      <div className="w-full min-w-0 overflow-hidden">
        <div className="grid w-full grid-cols-2 gap-2 border-b-0 border-gray-100 sm:flex sm:border-b">
          {TABS.map((tab, index) => {
            const isActive = index === activeTab;
            const barColor = TAB_COLORS[index] ?? "bg-gray-200";
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "font-dm-mono relative min-h-12 min-w-0 cursor-pointer rounded-lg bg-gray-50 px-2 py-3 text-center text-[9px] leading-tight font-medium tracking-[0.08em] uppercase transition-colors sm:min-h-0 sm:shrink-0 sm:rounded-none sm:bg-transparent sm:px-6 sm:py-4 sm:text-[10px] sm:tracking-wider",
                  index === TABS.length - 1 && "col-span-2 sm:col-span-1",
                  isActive
                    ? "font-bold text-gray-900"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <span className="block break-words whitespace-normal sm:whitespace-nowrap">
                  {tab}
                </span>
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
      <div className="scrollbar-none min-w-0 overflow-x-hidden overflow-y-auto p-0 sm:p-4">
        {activeTab === 0 && (
          <CompanyInfoStep
            companyId={companyId}
            isUpdateMode={true}
            hideLogoUpload={true}
          />
        )}
        {activeTab === 1 && (
          <CompanyIdentityStep companyId={companyId} isUpdateMode={true} />
        )}
        {activeTab === 2 && (
          <KnowledgeSourcesStep companyId={companyId} isUpdateMode={true} />
        )}
        {activeTab === 3 && (
          <AnswerBoundariesStep companyId={companyId} isUpdateMode={true} />
        )}
        {activeTab === 4 && (
          <VoiceConversationStep companyId={companyId} isUpdateMode={true} />
        )}
      </div>
    </div>
  );
}
