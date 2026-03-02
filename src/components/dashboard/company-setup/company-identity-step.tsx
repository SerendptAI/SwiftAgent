import { Loader2 } from "lucide-react";
import { useState } from "react";

import { useUpdateIdentity } from "@/hooks/use-company";

import { FormLabel, FormSelect, FormTextarea, NextButton } from "./ui-elements";

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
  const { mutateAsync: updateIdentity, isPending } = useUpdateIdentity();

  const [formData, setFormData] = useState({
    description: "",
    customer_value: "",
    brand_tone: "",
    primary_language: "en",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!companyId) {
        alert("Missing company data. Please go back.");
        return;
      }

      await updateIdentity({
        companyId,
        payload: formData,
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
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
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
                  value={formData.customer_value}
                  onChange={(e) =>
                    handleInputChange("customer_value", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="col-span-1">
                <FormLabel htmlFor="brandTone">Brand tone</FormLabel>
                <FormSelect
                  id="brandTone"
                  value={formData.brand_tone}
                  onChange={(e) =>
                    handleInputChange("brand_tone", e.target.value)
                  }
                >
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
                  value={formData.primary_language}
                  onChange={(e) =>
                    handleInputChange("primary_language", e.target.value)
                  }
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
                <NextButton onClick={handleSubmit} disabled={isPending}>
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
