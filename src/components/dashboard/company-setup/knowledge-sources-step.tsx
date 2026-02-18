import { Upload } from "lucide-react";
import { useState } from "react";

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
        <div className="relative flex h-16 items-center rounded-2xl bg-gray-100 p-1.5 shadow-sm">
          <button
            onClick={() => setCompanyType("saas")}
            className={cn(
              "relative z-10 flex h-full items-center gap-2 rounded-xl px-8 text-sm font-bold uppercase transition-all duration-300",
              companyType === "saas"
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-current">
              $
            </span>
            Saas/Finance
          </button>
          <button
            onClick={() => setCompanyType("crypto")}
            className={cn(
              "relative z-10 flex h-full items-center gap-2 rounded-xl px-8 text-sm font-bold uppercase transition-all duration-300",
              companyType === "crypto"
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            <span className="grid h-6 w-6 place-items-center">
              <div className="grid h-2 w-2 grid-cols-2 gap-0.5">
                <div className="rounded-[1px] bg-current" />
                <div className="rounded-[1px] bg-current" />
                <div className="rounded-[1px] bg-current" />
                <div className="rounded-[1px] bg-current" />
              </div>
            </span>
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
        "flex items-center justify-between rounded-full px-8 py-5 text-white shadow-md transition-transform hover:scale-[1.01]",
        color,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/30">
          <span className="font-serif text-white italic">?</span>
        </div>
        <span className="text-lg font-medium">{label}</span>
      </div>
      <button className="group flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30">
        Upload
        <div className="grid h-6 w-6 place-items-center rounded bg-white text-gray-900">
          <Upload className="h-4 w-4" />
        </div>
      </button>
    </div>
  );
}
