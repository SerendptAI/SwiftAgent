"use client";

import { useState } from "react";

import { CompanyInfoStep } from "./company-info-step";
import { StepIndicator } from "./step-indicator";

const STEPS = [
  "Company Information",
  "Company Identity",
  "Knowledge Sources",
  "Answer Boundaries",
  "Voice & Conversation",
];

export function SetupWizard() {
  const [currentStep] = useState(0);

  return (
    <div className="flex h-full flex-col">
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      <div className="flex-1 overflow-y-auto px-4 md:px-8">
        {currentStep === 0 && (
          <CompanyInfoStep
            currentStep={currentStep}
            totalSteps={STEPS.length}
          />
        )}
        {/* Placeholder for other steps */}
        {currentStep > 0 && (
          <div className="flex h-full items-center justify-center text-gray-400">
            Step {currentStep + 1} Content Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}
