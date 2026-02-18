import { FormLabel, FormSelect, FormTextarea, NextButton } from "./ui-elements";

interface CompanyIdentityStepProps {
  onNext?: () => void;
}

export function CompanyIdentityStep({ onNext }: CompanyIdentityStepProps) {
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
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="col-span-1">
                <FormLabel htmlFor="brandTone">Brand tone</FormLabel>
                <FormSelect id="brandTone" defaultValue="">
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
                <FormSelect id="primaryLanguage" defaultValue="en">
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
              <NextButton onClick={onNext} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
