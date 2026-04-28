"use client";

import Image from "next/image";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { useCurrentUser } from "@/hooks/use-auth";
import { useCompanyQuery } from "@/hooks/use-company";
import { useOnboardingStore } from "@/store/onboarding-store";

import { QuestionnaireChat } from "./questionnaire-chat";
import { NextButton } from "./ui-elements";

function IntroModal({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="absolute inset-y-0 right-[350px] left-0 flex items-center justify-center p-6 lg:left-[105px]">
        <div className="flex w-full max-w-2xl flex-col items-center bg-white px-14 py-16 text-center shadow-xl">
          <h2 className="font-greed-narrow mb-4 text-4xl font-bold text-gray-900">
            We&apos;d love to get to know your
            <br />
            organization better.
          </h2>

          <p className="font-dm-mono mb-6 text-sm tracking-wider text-gray-500 uppercase">
            Our AI agents have a few questions for you so we
            <br />
            can understand your organization better
          </p>

          <div className="mb-6">
            <Image
              src="/images/pixellife.svg"
              alt="Questionnaire"
              width={120}
              height={120}
              className="h-auto w-auto"
            />
          </div>

          <p className="font-dm-mono mb-8 flex items-center gap-1.5 text-[10px] tracking-wider text-gray-400 uppercase">
            <Icons.TimeFlow />
            Usually takes 5 minutes
          </p>

          <div className="w-full max-w-xs">
            <NextButton onClick={onStart} className="shadow-none">
              START QUESTIONER
            </NextButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompletionStep() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const { companyId: storeCompanyId, typedCompanyName } = useOnboardingStore();
  const { data: user } = useCurrentUser();
  const companyId = storeCompanyId || user?.company_id || null;
  const { data: companyData } = useCompanyQuery(companyId);

  const companyName = typedCompanyName || companyData?.name || "Your Company";
  const logoUrl = companyData?.logo_url;

  if (showQuestionnaire) {
    return (
      <QuestionnaireChat
        companyId={companyId}
        companyName={companyName}
        logoUrl={logoUrl}
        initialEmailSlug={companyData?.email_slug}
        enabledSources={companyData?.enabled_sources}
        customInfo={companyData?.custom_info}
        voiceStyle={companyData?.voice_style}
      />
    );
  }

  return <IntroModal onStart={() => setShowQuestionnaire(true)} />;
}
