import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRegistrationDetails } from "@/hooks/use-auth";
import { useCompanyMutations, useCompanyQuery } from "@/hooks/use-company";
import { getApiErrorMessage } from "@/lib/api-error";
import { useOnboardingStore } from "@/store/onboarding-store";

import { OnboardingErrorToast } from "./onboarding-error-toast";
import {
  BRAND_TONE_OPTIONS,
  LANGUAGE_OPTIONS,
  matchOptionValue,
} from "./select-options";
import { FormLabel, FormSelect, FormTextarea, NextButton } from "./ui-elements";

const companyIdentitySchema = z.object({
  description: z.string().optional(),
  customer_value: z.string().optional(),
  brand_tone: z.string().optional(),
  primary_language: z.string().optional(),
  support_emails: z.string().optional(),
});

type CompanyIdentityValues = z.infer<typeof companyIdentitySchema>;

interface CompanyIdentityStepProps {
  companyId?: string | null;
  isUpdateMode?: boolean;
  onNext?: () => void;
  footerAction?: React.ReactNode;
}

export function CompanyIdentityStep({
  companyId,
  isUpdateMode,
  onNext,
  footerAction,
}: CompanyIdentityStepProps) {
  const { updateCompany } = useCompanyMutations();
  const isPending = updateCompany.isPending;
  const [error, setError] = useState<string | null>(null);

  const { data: companyData } = useCompanyQuery(
    isUpdateMode ? companyId : null,
  );

  const { data: registrationDetails } = useRegistrationDetails(!isUpdateMode);

  const { register, handleSubmit, reset } = useForm<CompanyIdentityValues>({
    resolver: zodResolver(companyIdentitySchema),
    defaultValues: {
      description: companyData?.description || "",
      customer_value: companyData?.customer_value || "",
      brand_tone: companyData?.brand_tone || "",
      primary_language: companyData?.primary_language || "en",
      support_emails: companyData?.support_emails?.join(", ") || "",
    },
  });
  useEffect(() => {
    if (isUpdateMode && companyData) {
      reset({
        description: companyData.description || "",
        customer_value: companyData.customer_value || "",
        brand_tone: companyData.brand_tone || "",
        primary_language: companyData.primary_language || "en",
        support_emails: companyData.support_emails?.join(", ") || "",
      });
    }
  }, [isUpdateMode, companyData, reset]);

  useEffect(() => {
    if (!isUpdateMode && registrationDetails) {
      reset((current) => ({
        ...current,
        description:
          current.description || registrationDetails.company_description || "",
      }));
    }
  }, [isUpdateMode, registrationDetails, reset]);

  const scrapedData = useOnboardingStore((state) => state.scrapedData);

  // Prefill from the website-intro scrape; only fills fields left empty.
  // The company record already exists by this step, so isUpdateMode alone
  // can't distinguish onboarding from the settings editor — setup_complete
  // can. The guard also waits for companyData so the update-mode reset
  // above can't wipe the prefill afterwards.
  useEffect(() => {
    if (!scrapedData) return;
    if (isUpdateMode && companyData?.setup_complete !== false) return;
    reset((current) => ({
      ...current,
      description: current.description || scrapedData.description || "",
      customer_value:
        current.customer_value || scrapedData.customer_value || "",
      brand_tone:
        current.brand_tone ||
        matchOptionValue(BRAND_TONE_OPTIONS, scrapedData.brand_tone),
      primary_language:
        current.primary_language ||
        matchOptionValue(LANGUAGE_OPTIONS, scrapedData.primary_language),
      support_emails: current.support_emails || scrapedData.support_email || "",
    }));
  }, [isUpdateMode, companyData, scrapedData, reset]);

  const onSubmit = async (data: CompanyIdentityValues) => {
    try {
      if (!companyId) {
        setError("Missing company data. Please go back.");
        return;
      }

      await updateCompany.mutateAsync({
        companyId,
        section: "identity",
        payload: {
          ...data,
          support_emails: data.support_emails
            ? data.support_emails
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean)
            : [],
        },
      });

      onNext?.();
    } catch (error) {
      console.error(error);
      setError(
        getApiErrorMessage(
          error,
          "Failed to update company identity. Please try again.",
        ),
      );
    }
  };
  return (
    <div className="w-full max-w-4xl pb-4">
      <div className="flex flex-col gap-6 sm:gap-8">
        <div className="flex-1">
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="col-span-1">
                <FormLabel
                  htmlFor="companyDescription"
                  className="mb-2 text-sm sm:text-lg"
                >
                  Describe What Your Company Does In One Clear Sentence
                </FormLabel>
                <FormTextarea
                  id="companyDescription"
                  className="min-h-36 sm:min-h-[200px]"
                  placeholder="We empower businesses with cutting-edge AI solutions, driving efficiency and growth through intelligent automation."
                  {...register("description")}
                />
              </div>

              <div className="col-span-1">
                <FormLabel
                  htmlFor="customerValue"
                  className="mb-2 text-sm sm:text-lg"
                >
                  What Does Your Company Do For <br />
                  Customers?
                </FormLabel>
                <FormTextarea
                  id="customerValue"
                  className="min-h-36 sm:min-h-[200px]"
                  placeholder="Main problem you solve for customers"
                  {...register("customer_value")}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="col-span-1">
                <FormLabel htmlFor="brandTone">Brand tone</FormLabel>
                <FormSelect id="brandTone" {...register("brand_tone")}>
                  <option value="" disabled>
                    Select a tone
                  </option>
                  {BRAND_TONE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FormSelect>
              </div>

              <div className="col-span-1">
                <FormLabel htmlFor="primaryLanguage">
                  Primary Language
                </FormLabel>
                <FormSelect
                  id="primaryLanguage"
                  {...register("primary_language")}
                >
                  <option value="" disabled>
                    Select Language
                  </option>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FormSelect>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="col-span-1">
                <FormLabel htmlFor="supportEmails">Support Emails</FormLabel>
                <p className="mb-2 text-xs text-gray-400 sm:text-sm">
                  Separate emails with a comma.
                </p>
                <FormTextarea
                  id="supportEmails"
                  className="min-h-[100px]"
                  placeholder="noreply@email.com , soreply@email.com"
                  {...register("support_emails")}
                />
              </div>
            </div>

            <div className="mt-8">
              <OnboardingErrorToast
                message={error}
                onDismiss={() => setError(null)}
              />
              {footerAction ?? (
                <NextButton
                  onClick={handleSubmit(onSubmit)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : isUpdateMode ? (
                    "Update"
                  ) : (
                    "Finish"
                  )}
                </NextButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
