"use client";

import { useState } from "react";

import { AnswerBoundariesStep } from "./answer-boundaries-step";
import { CompanyIdentityStep } from "./company-identity-step";
import { CompanyInfoStep } from "./company-info-step";
import { KnowledgeSourcesStep } from "./knowledge-sources-step";
import { ProgressBar } from "./progress-bar";
import { StepIndicator } from "./step-indicator";
import { VoiceConversationStep } from "./voice-conversation-step";

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
  const [companyId, setCompanyId] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const isComplete = currentStep === STEPS.length;

  return (
    <div className="flex min-h-full flex-col">
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      <div className="flex-1 overflow-y-auto px-4 md:px-8">
        <div className="mb-12 max-w-4xl">
          <ProgressBar
            currentStep={isComplete ? STEPS.length - 1 : currentStep}
            totalSteps={STEPS.length}
            label={isComplete ? "VOICE & CONVERSATION" : STEPS[currentStep]}
          />
        </div>

        {currentStep === 0 && (
          <CompanyInfoStep onNext={handleNext} setCompanyId={setCompanyId} />
        )}
        {currentStep === 1 && (
          <CompanyIdentityStep companyId={companyId} onNext={handleNext} />
        )}
        {currentStep === 2 && (
          <KnowledgeSourcesStep companyId={companyId} onNext={handleNext} />
        )}
        {currentStep === 3 && (
          <AnswerBoundariesStep companyId={companyId} onNext={handleNext} />
        )}
        {currentStep === 4 && (
          <VoiceConversationStep companyId={companyId} onNext={handleNext} />
        )}

        {isComplete && <CompletionStep />}
      </div>
    </div>
  );
}
