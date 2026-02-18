import { useState } from "react";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

import { NextButton } from "./ui-elements";

interface KnowledgeSourcesStepProps {
  onNext?: () => void;
}

export function KnowledgeSourcesStep({ onNext }: KnowledgeSourcesStepProps) {
  const [companyType, setCompanyType] = useState<"saas" | "crypto">("saas");

  return (
    <div className="mx-auto w-full max-w-4xl pb-4">
      {/* Company Type Toggle */}
      <div className="mb-12 flex justify-center">
        <div className="relative flex items-center gap-8 rounded-2xl bg-gray-100 p-4 shadow-sm">
          <button
            onClick={() => setCompanyType("saas")}
            className={cn(
              "relative z-10 flex h-10 items-center gap-2 rounded-xl px-2 text-sm font-bold uppercase transition-all duration-300",
              companyType === "saas"
                ? "bg-white text-gray-900 shadow-[-6px_6px_0px_0px_#000000] ring-1 ring-black/5"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            <Icons.dollarbill />
            Saas/Finance
          </button>
          <button
            onClick={() => setCompanyType("crypto")}
            className={cn(
              "relative z-10 flex h-10 items-center gap-2 rounded-xl px-2 text-sm font-bold uppercase transition-all duration-300",
              companyType === "crypto"
                ? "bg-white text-gray-900 shadow-[-6px_6px_0px_0px_#000000] ring-1 ring-black/5"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            <Icons.dollar />
            Crypto Based Company
          </button>
        </div>
      </div>

      {/* Upload Sections */}
      <div className="space-y-6">
        <UploadSection
          color="bg-[#6433CC]" // Purple
          label="Upload FAQ documents"
        />
        <UploadSection
          color="bg-[#FF7043]" // Orange
          label="Upload Manuals"
        />
        <UploadSection
          color="bg-[#FFB74D]" // Yellow
          label="Upload policies"
        />
        <UploadSection
          color="bg-[#64B5F6]" // Blue
          label="Upload internal SOPs"
        />
      </div>

      <div className="mt-12">
        <NextButton onClick={onNext} />
      </div>
    </div>
  );
}

interface UploadSectionProps {
  color: string;
  label: string;
}

function UploadSection({ color, label }: UploadSectionProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg px-8 py-2 text-white shadow-[-6px_6px_0px_0px_#000000] transition-transform hover:scale-[1.01]",
        color,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/30">
          <span className="font-serif text-white italic">?</span>
        </div>
        <span className="text-lg font-medium">{label}</span>
      </div>
      <button className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30">
        Upload
        <Icons.upload className="h-8 w-8" />
      </button>
    </div>
  );
}
