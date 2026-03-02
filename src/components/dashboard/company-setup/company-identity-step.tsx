import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCompanyMutations } from "@/hooks/use-company";

import { FormLabel, FormSelect, FormTextarea, NextButton } from "./ui-elements";

const companyIdentitySchema = z.object({
  description: z.string().optional(),
  customer_value: z.string().optional(),
  brand_tone: z.string().optional(),
  primary_language: z.string().optional(),
});

type CompanyIdentityValues = z.infer<typeof companyIdentitySchema>;

interface CompanyIdentityStepProps {
  companyId?: string | null;
  onNext?: () => void;
  footerAction?: React.ReactNode;
}

export function CompanyIdentityStep({
  companyId,
  onNext,
  footerAction,
}: CompanyIdentityStepProps) {
  const { updateCompany } = useCompanyMutations();
  const isPending = updateCompany.isPending;

  const { register, handleSubmit } = useForm<CompanyIdentityValues>({
    resolver: zodResolver(companyIdentitySchema),
    defaultValues: {
      description: "",
      customer_value: "",
      brand_tone: "",
      primary_language: "en",
    },
  });

  const onSubmit = async (data: CompanyIdentityValues) => {
    try {
      if (!companyId) {
        alert("Missing company data. Please go back.");
        return;
      }

      await updateCompany.mutateAsync({
        companyId,
        section: "identity",
        payload: data,
      });

      onNext?.();
    } catch (error) {
      console.error(error);
      alert("Failed to update identity");
    }
  };
  return (
    <div className="w-full max-w-4xl pb-4">
      <div className="flex flex-col gap-8">
        {/* Left Column: Form */}
        <div className="flex-1">
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="col-span-1">
                <FormLabel
                  htmlFor="companyDescription"
                  className="mb-2 text-lg"
                >
                  Describe What Your Company Does In One Clear Sentence
                </FormLabel>
                <FormTextarea
                  id="companyDescription"
                  className="min-h-[200px]"
                  placeholder="We empower businesses with cutting-edge AI solutions, driving efficiency and growth through intelligent automation."
                  {...register("description")}
                />
              </div>

              <div className="col-span-1">
                <FormLabel htmlFor="customerValue" className="mb-2 text-lg">
                  What Does Your Company Do For <br />
                  Customers?
                </FormLabel>
                <FormTextarea
                  id="customerValue"
                  className="min-h-[200px]"
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
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="playful">Playful</option>
                  <option value="authoritative">Authoritative</option>
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
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </FormSelect>
              </div>
            </div>

            <div className="mt-8">
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
                  ) : (
                    "Next"
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
