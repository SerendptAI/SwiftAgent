"use client";

import { useEffect, useState } from "react";

import { useCompanyQuery } from "@/hooks/use-company";
import { useOnboardingStore } from "@/store/onboarding-store";

import { CompanyIdentityStep } from "./company-identity-step";
import { CompanyInfoStep } from "./company-info-step";
import { ProgressBar } from "./progress-bar";
import { StepIndicator } from "./step-indicator";

const STEPS = [
  "Company Information",
  "Company Identity",
  "Knowledge Sources",
  "Answer Boundaries",
  "Voice & Conversation",
];

import { CompletionStep } from "./completion-step";

export function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const { companyId, setCompanyId, setTypedCompanyName } = useOnboardingStore();

  const { data: companyData } = useCompanyQuery(companyId);

  // Sync the fetched company name back to the typed state if they revisit the page
  useEffect(() => {
    if (companyData?.name) {
      setTypedCompanyName(companyData.name);
    }
  }, [companyData?.name, setTypedCompanyName]);

  const handleNext = () => {
    if (currentStep === 1) {
      // After Company Identity, show completion screen
      setShowCompletion(true);
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      <div className="flex-1 overflow-y-auto px-4 md:px-8">
        {!showCompletion && (
          <div className="mb-12 max-w-4xl">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={STEPS.length}
              label={STEPS[currentStep]}
            />
          </div>
        )}

        {!showCompletion && currentStep === 0 && (
          <CompanyInfoStep onNext={handleNext} setCompanyId={setCompanyId} />
        )}
        {!showCompletion && currentStep === 1 && (
          <CompanyIdentityStep companyId={companyId} onNext={handleNext} />
        )}

        {showCompletion && <CompletionStep />}
      </div>
    </div>
  );
}
