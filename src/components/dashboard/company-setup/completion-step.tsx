"use client";

import { Check } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { useCompanyQuery } from "@/hooks/use-company";
import { useOnboardingStore } from "@/store/onboarding-store";

import { NextButton } from "./ui-elements";

const BriggsAnimation = dynamic(
  () => import("@/components/briggs-face-animation"),
  { ssr: false },
);

interface Question {
  id: number;
  text: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Are you a SAAS or crypto based company?",
    options: ["WE ARE A SAAS COMPANY.", "WE ARE A CRYPTO COMPANY."],
  },
];

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

function QuestionnaireChat({
  companyName,
  logoUrl,
}: {
  companyName: string;
  logoUrl?: string;
}) {
  const [currentQuestion] = useState(0);
  const question = QUESTIONS[currentQuestion];

  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="absolute inset-y-0 right-[350px] left-0 flex items-center justify-center p-6 lg:left-[105px]">
        <div className="absolute right-0 flex h-[70%] w-full max-w-md flex-col bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <Image
                src={logoUrl || "/images/company_logo_new.svg"}
                alt={companyName}
                width={24}
                height={24}
                className="rounded"
              />
              <span className="font-dm-mono text-sm font-bold tracking-wider uppercase">
                {companyName}
              </span>
            </div>
            <Check className="h-5 w-5 text-gray-400" />
          </div>

          {/* Chat body */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-6 w-fit max-w-[80%] rounded-lg bg-blue-50 px-4 py-3">
              <p className="text-sm font-medium text-blue-600">
                {question.text}
              </p>
            </div>

            <div className="space-y-4">
              {question.options.map((option) => (
                <button
                  key={option}
                  className="font-dm-mono block w-full cursor-pointer px-4 py-2 text-left text-sm font-bold tracking-wide text-gray-900 uppercase transition-colors hover:text-blue-600"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Rive animation at bottom center of chat card */}
          <div className="absolute right-0 -bottom-20 -translate-x-1/2">
            <BriggsAnimation className="h-16 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompletionStep() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const { companyId, typedCompanyName } = useOnboardingStore();
  const { data: companyData } = useCompanyQuery(companyId);

  const companyName = typedCompanyName || companyData?.name || "Your Company";
  const logoUrl = companyData?.logo_url;

  if (showQuestionnaire) {
    return <QuestionnaireChat companyName={companyName} logoUrl={logoUrl} />;
  }

  return <IntroModal onStart={() => setShowQuestionnaire(true)} />;
}
