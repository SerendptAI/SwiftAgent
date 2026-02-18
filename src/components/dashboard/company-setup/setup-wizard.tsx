"use client";

import { useState } from "react";

import { AnswerBoundariesStep } from "./answer-boundaries-step";
import { CompanyIdentityStep } from "./company-identity-step";
import { CompanyInfoStep } from "./company-info-step";
import { KnowledgeSourcesStep } from "./knowledge-sources-step";
import { ProgressBar } from "./progress-bar";
import { StepIndicator } from "./step-indicator";

const STEPS = [
  "Company Information",
  "Company Identity",
  "Knowledge Sources",
  "Answer Boundaries",
  "Voice & Conversation",
];

export function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      <div className="flex-1 overflow-y-auto px-4 md:px-8">
        <div className="mb-12 max-w-4xl">
          <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} />
        </div>
        {currentStep === 0 && <CompanyInfoStep onNext={handleNext} />}
        {currentStep === 1 && <CompanyIdentityStep onNext={handleNext} />}
        {currentStep === 2 && <KnowledgeSourcesStep onNext={handleNext} />}
        {currentStep === 3 && <AnswerBoundariesStep onNext={handleNext} />}
        {/* Placeholder for other steps */}
        {currentStep > 3 && (
          <div className="flex h-full items-center justify-center text-gray-400">
            Step {currentStep + 1} Content Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}
