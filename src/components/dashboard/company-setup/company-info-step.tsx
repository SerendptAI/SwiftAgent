import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { FormInput, FormLabel, FormSelect, NextButton } from "./ui-elements";

interface CompanyInfoStepProps {
  onNext?: () => void;
}

export function CompanyInfoStep({ onNext }: CompanyInfoStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl pb-4">
      <div className="mb-6">
        <div className="flex items-start gap-6">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Company Logo"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 overflow-hidden bg-[#FF5722]">
                <div className="absolute -top-4 -left-4 text-[#FF8A65]/50">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                  </svg>
                </div>
                <div className="absolute top-8 right-4 rotate-45 text-[#FFCCBC]/50">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                  </svg>
                </div>
                <div className="absolute bottom-2 left-8 -rotate-12 text-[#FFAB91]/50">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                  </svg>
                </div>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-2 bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50"
            >
              <Pencil className="h-4 w-4 text-gray-900" />
            </button>
          </div>
          <div className="flex flex-col justify-center pt-8">
            <FormLabel>COMPANY LOGO</FormLabel>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#6433CC] px-6 py-2.5 text-sm font-medium text-white shadow-[-6px_6px_0px_0px_#000000] transition-colors hover:bg-purple-700"
            >
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
        <div className="col-span-1">
          <FormLabel htmlFor="companyName">Company Name</FormLabel>
          <FormInput id="companyName" placeholder="Company Legal Name" />
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="website">Company Website</FormLabel>
          <FormInput id="website" placeholder="https://site.com" />
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="industry">Industry</FormLabel>
          <FormSelect id="industry" defaultValue="">
            <option value="" disabled>
              Select an industry
            </option>
            <option value="tech">Technology</option>
            <option value="finance">Finance</option>
            <option value="health">Healthcare</option>
            <option value="retail">Retail</option>
          </FormSelect>
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="size">Company Size</FormLabel>
          <FormSelect id="size" defaultValue="">
            <option value="" disabled>
              Select a company size
            </option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201+">201+ employees</option>
          </FormSelect>
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="country">Country of Operation</FormLabel>
          <FormSelect id="country" defaultValue="">
            <option value="" disabled>
              Select Country
            </option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="ng">Nigeria</option>
          </FormSelect>
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="timezone">Timezone</FormLabel>
          <FormSelect id="timezone" defaultValue="">
            <option value="" disabled>
              Select Timezone
            </option>
            <option value="utc">UTC</option>
            <option value="est">EST</option>
            <option value="pst">PST</option>
            <option value="wat">WAT</option>
          </FormSelect>
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="email">Primary Contact Email</FormLabel>
          <FormInput id="email" type="email" placeholder="Botonte@yahoo.com" />
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="phone">Primary phone number</FormLabel>
          <FormInput id="phone" type="tel" placeholder="+2349057004914" />
        </div>
      </div>

      <div className="mt-6">
        <NextButton onClick={onNext} />
      </div>
    </div>
  );
}
