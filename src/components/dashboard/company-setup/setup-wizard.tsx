"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useSetActiveCompanyId } from "@/hooks/use-active-company";
import { useCurrentUser, useRegistrationDetails } from "@/hooks/use-auth";
import { useCompaniesQuery, useCompanyQuery } from "@/hooks/use-company";
import { trackEvent } from "@/lib/analytics";
import { useOnboardingStore } from "@/store/onboarding-store";

import { CompanyIdentityStep } from "./company-identity-step";
import { CompanyInfoStep } from "./company-info-step";
import { CompletionStep } from "./completion-step";
import { ProgressBar } from "./progress-bar";
import { StepIndicator } from "./step-indicator";
import { WebsiteIntroStep } from "./website-intro-step";

const STEPS = [
  "Company Information",
  "Company Identity",
  "Knowledge Sources",
  "Answer Boundaries",
  "Voice & Conversation",
];

export function SetupWizard() {
  const searchParams = useSearchParams();
  const isNewCompany = searchParams.get("new_company") === "1";
  const didInitializeNewCompanyFlow = useRef(false);
  const didResumeStep = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [websiteIntroDone, setWebsiteIntroDone] = useState(false);
  const {
    companyId,
    scrapedData,
    setCompanyId,
    setTypedCompanyName,
    setWebsiteUrl,
    setScrapedData,
  } = useOnboardingStore();
  const { data: user } = useCurrentUser();
  const { data: companies } = useCompaniesQuery();
  const setActiveCompanyId = useSetActiveCompanyId();

  // Fall back to the company that is still being onboarded — covers the case
  // where the user reloads (or opens another device) before `user.company_id`
  // has propagated. The backend is the source of truth, so this resumes the
  // in-progress company instead of creating a duplicate.
  const inProgressCompanyId = companies?.find((c) => !c.setup_complete)?.id;

  const effectiveCompanyId = isNewCompany
    ? companyId
    : (user?.company_id ?? companyId ?? inProgressCompanyId ?? null);
  const shouldUpdateExistingCompany = !isNewCompany && !!effectiveCompanyId;

  const { data: companyData } = useCompanyQuery(effectiveCompanyId);

  // The registration record describes the company the user signed up with, so
  // a further company added later must not inherit its scrape. React Query
  // still hands back cached data while a query is disabled, so `isNewCompany`
  // is checked here rather than relied on through `enabled` alone.
  const registrationQuery = useRegistrationDetails(!isNewCompany);
  const preScrapedData = isNewCompany
    ? null
    : (registrationQuery.data?.scraped_data ?? null);

  useEffect(() => {
    if (isNewCompany) {
      if (!didInitializeNewCompanyFlow.current) {
        didInitializeNewCompanyFlow.current = true;
        setCompanyId(null);
        setTypedCompanyName("");
        setWebsiteUrl("");
        setScrapedData(null);
      }
      return;
    }

    didInitializeNewCompanyFlow.current = false;

    const resolvedCompanyId = user?.company_id ?? inProgressCompanyId;
    if (resolvedCompanyId) {
      setCompanyId(resolvedCompanyId);
      setActiveCompanyId(resolvedCompanyId);
    }
  }, [
    isNewCompany,
    inProgressCompanyId,
    setActiveCompanyId,
    setCompanyId,
    setTypedCompanyName,
    setWebsiteUrl,
    setScrapedData,
    user?.company_id,
  ]);

  // Resume at the step the backend recorded so a refresh (on any device) lands
  // where the user left off instead of restarting at Company Information.
  useEffect(() => {
    if (isNewCompany || didResumeStep.current) return;
    if (companyData && !companyData.setup_complete) {
      didResumeStep.current = true;
      const resumeStep = Math.min(
        Math.max(companyData.onboarding_step ?? 0, 0),
        1,
      );
      setCurrentStep(resumeStep);
    }
  }, [isNewCompany, companyData]);

  // Sync the fetched company name back to the typed state if they revisit the page
  useEffect(() => {
    if (companyData?.name) {
      setTypedCompanyName(companyData.name);
    }
  }, [companyData?.name, setTypedCompanyName]);

  // Approval-time scraping means the forms can open already filled. A scrape
  // the user runs on the intro step is the more deliberate one, so it is never
  // overwritten here.
  useEffect(() => {
    const details = isNewCompany ? undefined : registrationQuery.data;
    if (!details || scrapedData) return;
    if (details.company_website) setWebsiteUrl(details.company_website);
    if (details.scraped_data) setScrapedData(details.scraped_data);
  }, [
    isNewCompany,
    registrationQuery.data,
    scrapedData,
    setScrapedData,
    setWebsiteUrl,
  ]);

  // Only brand-new companies get the website intro; resuming an in-progress
  // company (or waiting on the user fetch) goes straight to the form. Asking
  // for a website already scraped at approval would re-run that work, so the
  // step is skipped once pre-scraped data is in hand — and the decision waits
  // for the lookup to settle, or the step would flash up and vanish.
  const showWebsiteIntro =
    !websiteIntroDone &&
    !registrationQuery.isLoading &&
    !preScrapedData &&
    (isNewCompany || (!!user && !effectiveCompanyId));

  const handleNext = () => {
    trackEvent("onboarding_step_completed", {
      step_index: currentStep,
      step_name: STEPS[currentStep],
    });

    if (currentStep === 1) {
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

        {currentStep === 0 &&
          (showWebsiteIntro ? (
            <WebsiteIntroStep onDone={() => setWebsiteIntroDone(true)} />
          ) : (
            <CompanyInfoStep
              companyId={effectiveCompanyId}
              isUpdateMode={shouldUpdateExistingCompany}
              onNext={handleNext}
              setCompanyId={setCompanyId}
            />
          ))}
        {currentStep === 1 && (
          <CompanyIdentityStep
            companyId={effectiveCompanyId}
            isUpdateMode={shouldUpdateExistingCompany}
            onNext={handleNext}
          />
        )}

        {showCompletion && <CompletionStep />}
      </div>
    </div>
  );
}
