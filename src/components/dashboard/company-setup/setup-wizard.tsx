"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useSetActiveCompanyId } from "@/hooks/use-active-company";
import { useCurrentUser } from "@/hooks/use-auth";
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
  const searchParams = useSearchParams();
  const isNewCompany = searchParams.get("new_company") === "1";
  const didInitializeNewCompanyFlow = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const { companyId, setCompanyId, setTypedCompanyName } = useOnboardingStore();
  const { data: user } = useCurrentUser();
  const setActiveCompanyId = useSetActiveCompanyId();

  const effectiveCompanyId = isNewCompany
    ? companyId
    : (user?.company_id ?? companyId);
  const shouldUpdateExistingCompany = !isNewCompany && !!user?.company_id;

  const { data: companyData } = useCompanyQuery(effectiveCompanyId);

  useEffect(() => {
    if (isNewCompany) {
      if (!didInitializeNewCompanyFlow.current) {
        didInitializeNewCompanyFlow.current = true;
        setCompanyId(null);
        setTypedCompanyName("");
      }
      return;
    }

    didInitializeNewCompanyFlow.current = false;

    if (user?.company_id) {
      setCompanyId(user.company_id);
      setActiveCompanyId(user.company_id);
    }
  }, [
    isNewCompany,
    setActiveCompanyId,
    setCompanyId,
    setTypedCompanyName,
    user?.company_id,
  ]);

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
        <div className="mb-12 max-w-4xl">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={STEPS.length}
            label={STEPS[currentStep]}
          />
        </div>

        {currentStep === 0 && (
          <CompanyInfoStep
            companyId={effectiveCompanyId}
            isUpdateMode={shouldUpdateExistingCompany}
            onNext={handleNext}
            setCompanyId={setCompanyId}
          />
        )}
        {currentStep === 1 && (
          <CompanyIdentityStep
            companyId={effectiveCompanyId}
            onNext={handleNext}
          />
        )}

        {showCompletion && <CompletionStep />}
      </div>
    </div>
  );
}
