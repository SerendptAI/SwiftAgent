import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/components/icons";
import { useCompanyMutations, useCompanyQuery } from "@/hooks/use-company";
import {
  useKnowledgeDocuments,
  useUploadKnowledge,
} from "@/hooks/use-knowledge";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import type { KnowledgeDocument } from "@/services/knowledge";

import { OnboardingErrorToast } from "./onboarding-error-toast";
import { NextButton } from "./ui-elements";

const knowledgeSourcesSchema = z.object({
  companyType: z.enum(["saas", "crypto"]),
});

type KnowledgeSourcesValues = z.infer<typeof knowledgeSourcesSchema>;

interface KnowledgeSourcesStepProps {
  companyId?: string | null;
  isUpdateMode?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  footerAction?: React.ReactNode;
}

export function KnowledgeSourcesStep({
  companyId,
  isUpdateMode,
  onNext,
  footerAction,
}: KnowledgeSourcesStepProps) {
  const { updateCompany } = useCompanyMutations();
  const isPending = updateCompany.isPending;
  const [error, setError] = useState<string | null>(null);
  const [cryptoPage, setCryptoPage] = useState<1 | 2>(1);

  const { data: companyData } = useCompanyQuery(
    isUpdateMode ? companyId : null,
  );

  const { data: existingDocs } = useKnowledgeDocuments(
    isUpdateMode ? companyId : null,
  );

  const docFor = (category: string) =>
    existingDocs?.find((d) => d.category === category);

  const { watch, setValue, handleSubmit, reset } =
    useForm<KnowledgeSourcesValues>({
      resolver: zodResolver(knowledgeSourcesSchema),
      defaultValues: {
        companyType: (companyData?.company_type === "crypto"
          ? "crypto"
          : "saas") as "saas" | "crypto",
      },
    });

  useEffect(() => {
    if (isUpdateMode && companyData) {
      reset({
        companyType: (companyData.company_type === "crypto"
          ? "crypto"
          : "saas") as "saas" | "crypto",
      });
    }
  }, [isUpdateMode, companyData, reset]);

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
      setError(
        getApiErrorMessage(
          error,
          "Failed to update company type. Please try again.",
        ),
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl pb-4">
      {/* Company Type Toggle */}
      <div className="mb-8 flex justify-center sm:mb-12">
        <div className="relative grid w-full grid-cols-1 gap-2 rounded-2xl bg-gray-100 p-3 shadow-sm sm:w-fit sm:grid-cols-2 sm:gap-8 sm:p-4">
          <button
            onClick={() => setValue("companyType", "saas")}
            className={cn(
              "relative z-10 flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold uppercase transition-all duration-300 sm:justify-start sm:px-2 sm:text-sm",
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
              "relative z-10 flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold uppercase transition-all duration-300 sm:justify-start sm:px-2 sm:text-sm",
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
              color="bg-[#6433CC]"
              label="Upload FAQ documents"
              existingDoc={docFor("faq")}
            />
            <UploadSection
              companyId={companyId}
              category="manuals"
              color="bg-[#FF7043]"
              label="Upload Manuals"
              existingDoc={docFor("manuals")}
            />
            <UploadSection
              companyId={companyId}
              category="policies"
              color="bg-[#FFB74D]"
              label="Upload policies"
              existingDoc={docFor("policies")}
            />
            <UploadSection
              companyId={companyId}
              category="sops"
              color="bg-[#64B5F6]"
              label="Upload internal SOPs"
              existingDoc={docFor("sops")}
            />
          </>
        ) : cryptoPage === 1 ? (
          <>
            <UploadSection
              companyId={companyId}
              category="faq"
              color="bg-[#6433CC]"
              label="Upload FAQ documents"
              existingDoc={docFor("faq")}
            />
            <UploadSection
              companyId={companyId}
              category="whitepaper"
              color="bg-[#FF7043]"
              label="Upload Whitepaper"
              existingDoc={docFor("whitepaper")}
            />
            <UploadSection
              companyId={companyId}
              category="tokenomics"
              color="bg-[#FFB74D]"
              label="Tokenomics Documentation"
              existingDoc={docFor("tokenomics")}
            />
            <UploadSection
              companyId={companyId}
              category="links"
              color="bg-[#6433CC]"
              label="Blockchain Explorer Links"
              existingDoc={docFor("links")}
            />
          </>
        ) : (
          <>
            <UploadSection
              companyId={companyId}
              category="audit_reports"
              color="bg-[#6433CC]"
              label="Audit Reports"
              existingDoc={docFor("audit_reports")}
            />
            <UploadSection
              companyId={companyId}
              category="governance"
              color="bg-[#FF7043]"
              label="Governance Documentation"
              existingDoc={docFor("governance")}
            />
            <UploadSection
              companyId={companyId}
              category="roadmap"
              color="bg-[#FFB74D]"
              label="Roadmap and Updates"
              existingDoc={docFor("roadmap")}
            />
            <UploadSection
              companyId={companyId}
              category="risk_disclosures"
              color="bg-[#64B5F6]"
              label="Risk Disclosures"
              existingDoc={docFor("risk_disclosures")}
            />
            <UploadSection
              companyId={companyId}
              category="community_support"
              color="bg-[#6433CC]"
              label="Community and Support Docs"
              existingDoc={docFor("community_support")}
            />
          </>
        )}
      </div>

      <div className="mt-12">
        <OnboardingErrorToast
          message={error}
          onDismiss={() => setError(null)}
        />
        {footerAction ??
          (companyType === "saas" ? (
            <NextButton onClick={handleSubmit(onSubmit)} disabled={isPending}>
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : isUpdateMode ? (
                "UPDATE"
              ) : (
                "Next"
              )}
            </NextButton>
          ) : cryptoPage === 1 ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setCryptoPage(2)}
                className="w-full cursor-pointer rounded-xl bg-[#006BE5] py-3 text-center font-semibold text-white shadow-[-6px_6px_0px_0px_#000000] transition-colors hover:bg-[#0055B8] sm:py-4"
              >
                Next
              </button>
              <button
                onClick={() => setCryptoPage(2)}
                className="flex h-[38px] w-[80px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#D6E4FF] shadow-[-6px_6px_0px_0px_#00000033] transition-colors hover:bg-blue-200"
              >
                <div className="h-0 w-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-[#006BE5]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setCryptoPage(1)}
                className="flex h-[38px] w-[80px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#D6E4FF] shadow-[-6px_6px_0px_0px_#00000033] transition-colors hover:bg-blue-200"
              >
                <div className="h-0 w-0 border-t-8 border-r-12 border-b-8 border-t-transparent border-r-[#006BE5] border-b-transparent" />
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                className="w-full cursor-pointer rounded-xl bg-[#006BE5] py-3 text-center font-semibold text-white shadow-[-6px_6px_0px_0px_#000000] transition-colors hover:bg-[#0055B8] disabled:opacity-50 sm:py-2"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : isUpdateMode ? (
                  "UPDATE"
                ) : (
                  "Next"
                )}
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
  existingDoc?: KnowledgeDocument;
}

function UploadSection({
  companyId,
  category,
  color,
  label,
  existingDoc,
}: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    existingDoc?.filename ?? null,
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mutateAsync: uploadKnowledge, isPending } = useUploadKnowledge();

  useEffect(() => {
    if (existingDoc?.filename && !uploadedFileName) {
      setUploadedFileName(existingDoc.filename);
    }
  }, [existingDoc?.filename]);

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
      setUploadedFileName(file.name);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      setUploadError(
        getApiErrorMessage(
          error,
          `Failed to upload ${file.name}. Please try again.`,
        ),
      );
    }
  };

  return (
    <>
      <OnboardingErrorToast
        message={uploadError}
        onDismiss={() => setUploadError(null)}
      />
      <div
        className={cn(
          "font-dm-mono flex flex-col gap-4 rounded-lg px-4 py-4 text-white shadow-[-4px_4px_0px_0px_#000000] transition-transform hover:scale-[1.01] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-2 sm:shadow-[-6px_6px_0px_0px_#000000]",
          color,
        )}
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-7 w-7 shrink-0 sm:h-8 sm:w-8">
            <Icons.companyupload className="h-8 w-8" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium sm:text-lg">{label}</span>
            {uploadedFileName && (
              <span className="max-w-full truncate text-xs text-white/80 sm:max-w-[200px] sm:text-sm">
                {uploadedFileName}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleUploadClick}
          disabled={isPending}
          className={cn(
            "group flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-colors hover:bg-white/30 disabled:opacity-50 sm:w-auto sm:py-2",
            uploadedFileName && "bg-green-500/20 hover:bg-green-500/30",
          )}
        >
          {isPending ? (
            <>
              Uploading...
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : uploadedFileName ? (
            <>
              Replace
              <Icons.upload className="h-5 w-5" />
            </>
          ) : (
            <>
              Upload
              <Icons.upload className="h-5 w-5" />
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
    </>
  );
}
