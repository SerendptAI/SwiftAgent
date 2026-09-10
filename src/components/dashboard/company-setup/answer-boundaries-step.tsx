import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { useCompanyMutations, useCompanyQuery } from "@/hooks/use-company";
import { getApiErrorMessage } from "@/lib/api-error";

import { OnboardingErrorToast } from "./onboarding-error-toast";
import { NextButton } from "./ui-elements";

const answerBoundariesSchema = z.object({
  ignoredTopics: z.array(z.string()),
  availableTopics: z.array(z.string()),
});

type AnswerBoundariesValues = z.infer<typeof answerBoundariesSchema>;

interface AnswerBoundariesStepProps {
  companyId?: string | null;
  isUpdateMode?: boolean;
  onNext?: () => void;
  footerAction?: React.ReactNode;
}

export function AnswerBoundariesStep({
  companyId,
  isUpdateMode,
  onNext,
  footerAction,
}: AnswerBoundariesStepProps) {
  const { updateCompany } = useCompanyMutations();
  const isPending = updateCompany.isPending;
  const [error, setError] = useState<string | null>(null);

  const { data: companyData } = useCompanyQuery(
    isUpdateMode ? companyId : null,
  );

  const { control, handleSubmit, watch, reset } =
    useForm<AnswerBoundariesValues>({
      resolver: zodResolver(answerBoundariesSchema),
      defaultValues: {
        ignoredTopics: companyData?.custom_info || [
          "FAQ",
          "MANUALS",
          "POLICIES",
          "SOPS",
          "INFO",
          "INFO",
          "INFO",
          "INFO",
          "INFO",
          "INFO",
          "INFO",
          "INFO",
          "INFO",
          "INFO",
          "INFO",
        ],
        availableTopics: companyData?.enabled_sources || [
          "INFO",
          "INFO",
          "INFO",
          "INFO",
          "INFO",
        ],
      },
    });

  useEffect(() => {
    if (isUpdateMode && companyData) {
      reset({
        ignoredTopics: companyData.custom_info || [],
        availableTopics: companyData.enabled_sources || [],
      });
    }
  }, [isUpdateMode, companyData, reset]);

  const {
    fields: ignoredFields,
    remove: removeIgnoredTopic,
    append: appendIgnored,
  } = useFieldArray({
    control,
    name: "ignoredTopics" as never, // cast due to zod typing constraints with simple string arrays
  });

  const {
    fields: availableFields,
    remove: removeAvailableTopic,
    append: appendAvailable,
  } = useFieldArray({
    control,
    name: "availableTopics" as never,
  });

  const ignoredTopics = watch("ignoredTopics");
  const availableTopics = watch("availableTopics");

  const removeIgnored = (index: number) => {
    const topic = ignoredTopics[index];
    removeIgnoredTopic(index);
    appendAvailable(topic as never);
  };

  const addIgnored = (index: number) => {
    const topic = availableTopics[index];
    removeAvailableTopic(index);
    appendIgnored(topic as never);
  };

  const onSubmit = async (data: AnswerBoundariesValues) => {
    try {
      if (!companyId) {
        setError("Missing company data. Please go back.");
        return;
      }

      await updateCompany.mutateAsync({
        companyId,
        section: "boundaries",
        payload: {
          enabled_sources: data.availableTopics,
          custom_info: data.ignoredTopics,
        },
      });

      onNext?.();
    } catch (error) {
      console.error(error);
      setError(
        getApiErrorMessage(
          error,
          "Failed to update answer boundaries. Please try again.",
        ),
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl pb-4 text-center">
      <h2 className="mb-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
        What uploaded information should the AI ignore?
      </h2>
      <p className="mb-6 text-xs text-gray-400 sm:mb-8 sm:text-sm">
        Any information that is ignored will not be used to talk to clients
      </p>

      <div className="mb-10 flex flex-wrap justify-center gap-2 rounded-2xl bg-gray-100 p-4 shadow-inner sm:mb-12 sm:gap-4 sm:rounded-3xl sm:p-8">
        {ignoredFields.map((field, index) => (
          <button
            key={field.id}
            onClick={() => removeIgnored(index)}
            className="group flex items-center gap-2 rounded-xl bg-white px-2.5 py-2 text-xs font-bold text-gray-900 uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:translate-y-[2px] hover:shadow-[-2px_2px_0px_0px_#000000] sm:gap-3 sm:px-3 sm:py-3 sm:text-sm sm:shadow-[-4px_4px_0px_0px_#000000]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5F3D] text-white">
              <X className="h-3 w-3" />
            </span>
            {ignoredTopics[index]}
          </button>
        ))}
      </div>

      <h2 className="mb-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
        Ignored Information
      </h2>
      <p className="mb-6 text-xs text-gray-400 sm:mb-8 sm:text-sm">
        Tap the plus sign to add it back
      </p>

      <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-gray-100 p-4 shadow-inner sm:gap-4 sm:rounded-3xl sm:p-8">
        {availableFields.map((field, index) => (
          <button
            key={field.id}
            onClick={() => addIgnored(index)}
            className="group flex items-center gap-2 rounded-xl bg-white px-2.5 py-2 text-xs font-bold text-gray-900 uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:translate-y-[2px] hover:shadow-[-2px_2px_0px_0px_#000000] sm:gap-3 sm:px-3 sm:py-3 sm:text-sm sm:shadow-[-4px_4px_0px_0px_#000000]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-black">
              <Plus className="h-3 w-3" />
            </span>
            {availableTopics[index]}
          </button>
        ))}
      </div>

      <div className="mt-12">
        <OnboardingErrorToast
          message={error}
          onDismiss={() => setError(null)}
        />
        {footerAction ?? (
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
        )}
      </div>
    </div>
  );
}
