import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/components/icons";
import { useCompanyMutations } from "@/hooks/use-company";
import { useUploadKnowledge } from "@/hooks/use-knowledge";
import { cn } from "@/lib/utils";

import { NextButton } from "./ui-elements";

const knowledgeSourcesSchema = z.object({
  companyType: z.enum(["saas", "crypto"]),
});

type KnowledgeSourcesValues = z.infer<typeof knowledgeSourcesSchema>;

interface KnowledgeSourcesStepProps {
  companyId?: string | null;
  onNext?: () => void;
  footerAction?: React.ReactNode;
}

export function KnowledgeSourcesStep({
  companyId,
  onNext,
  footerAction,
}: KnowledgeSourcesStepProps) {
  const { updateCompany } = useCompanyMutations();
  const isPending = updateCompany.isPending;

  const { watch, setValue, handleSubmit } = useForm<KnowledgeSourcesValues>({
    resolver: zodResolver(knowledgeSourcesSchema),
    defaultValues: {
      companyType: "saas",
    },
  });

  const companyType = watch("companyType");

  const onSubmit = async (data: KnowledgeSourcesValues) => {
    try {
      if (!companyId) {
        alert("Missing company data. Please go back.");
        return;
      }

      await updateCompany.mutateAsync({
        companyId,
        section: "type",
        payload: {
          company_type: data.companyType === "saas" ? "saas_finance" : "crypto",
        },
      });

      onNext?.();
    } catch (error) {
      console.error(error);
      alert("Failed to update company type");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl pb-4">
      {/* Company Type Toggle */}
      <div className="mb-12 flex justify-center">
        <div className="relative flex items-center gap-8 rounded-2xl bg-gray-100 p-4 shadow-sm">
          <button
            onClick={() => setValue("companyType", "saas")}
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
            onClick={() => setValue("companyType", "crypto")}
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
      {/* Upload Sections */}
      <div className="space-y-6">
        {companyType === "saas" ? (
          <>
            <UploadSection
              companyId={companyId}
              category="faq"
              color="bg-[#6433CC]" // Purple
              label="Upload FAQ documents"
            />
            <UploadSection
              companyId={companyId}
              category="manuals"
              color="bg-[#FF7043]" // Orange
              label="Upload Manuals"
            />
            <UploadSection
              companyId={companyId}
              category="policies"
              color="bg-[#FFB74D]" // Yellow
              label="Upload policies"
            />
            <UploadSection
              companyId={companyId}
              category="sops"
              color="bg-[#64B5F6]" // Blue
              label="Upload internal SOPs"
            />
          </>
        ) : (
          <>
            <UploadSection
              companyId={companyId}
              category="faq"
              color="bg-[#6433CC]" // Purple
              label="Upload FAQ documents"
            />
            <UploadSection
              companyId={companyId}
              category="whitepaper"
              color="bg-[#FF7043]" // Orange
              label="Upload Whitepaper"
            />
            <UploadSection
              companyId={companyId}
              category="tokenomics"
              color="bg-[#FFB74D]" // Yellow
              label="Tokenomics Documentation"
            />
            <UploadSection
              companyId={companyId}
              category="links"
              color="bg-[#6433CC]" // Purple
              label="Blockchain Explorer Links"
            />
          </>
        )}
      </div>

      <div className="mt-12">
        {footerAction ??
          (companyType === "saas" ? (
            <NextButton onClick={handleSubmit(onSubmit)} disabled={isPending}>
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Next"
              )}
            </NextButton>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                className="w-full cursor-pointer rounded-xl bg-[#8DA4FF] py-4 text-center font-semibold text-white shadow-[-6px_6px_0px_0px_#000000] transition-colors hover:bg-blue-400 disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Next"}
              </button>
              <button
                onClick={onNext}
                className="flex h-[56px] w-[80px] cursor-pointer items-center justify-center rounded-xl bg-[#D6E4FF] shadow-[-6px_6px_0px_0px_#00000033] transition-colors hover:bg-blue-200"
              >
                <div className="h-0 w-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-white" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

interface UploadSectionProps {
  companyId?: string | null;
  category: string;
  color: string;
  label: string;
}

function UploadSection({
  companyId,
  category,
  color,
  label,
}: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutateAsync: uploadKnowledge, isPending } = useUploadKnowledge();

  const handleUploadClick = () => {
    if (!companyId) {
      alert("Please ensure company is created first (Go back to step 1).");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !companyId) return;

    try {
      await uploadKnowledge({ companyId, category, file });
      setIsSuccess(true);
      // Reset input to allow selecting the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert(`Failed to upload ${file.name}`);
    }
  };

  return (
    <div
      className={cn(
        "font-dm-mono flex items-center justify-between rounded-lg px-8 py-2 text-white shadow-[-6px_6px_0px_0px_#000000] transition-transform hover:scale-[1.01]",
        color,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8">
          <Icons.companyupload className="h-8 w-8" />
        </div>
        <span className="text-lg font-medium">{label}</span>
      </div>
      <button
        onClick={handleUploadClick}
        disabled={isPending || isSuccess}
        className={cn(
          "group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30 disabled:opacity-50",
          isSuccess && "bg-green-500/20 text-white hover:bg-green-500/30",
        )}
      >
        {isPending ? (
          <>
            Uploading...
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : isSuccess ? (
          <>
            Uploaded
            <Check className="h-5 w-5" />
          </>
        ) : (
          <>
            Upload
            <Icons.upload className="h-8 w-8" />
          </>
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
