import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/components/icons";
import {
  useCompaniesQuery,
  useCompanyMutations,
  useCompanyQuery,
} from "@/hooks/use-company";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/store/onboarding-store";

import { OnboardingErrorToast } from "./onboarding-error-toast";
import { FormInput, FormLabel, FormSelect, NextButton } from "./ui-elements";

const companyInfoSchema = z.object({
  name: z.string().min(1, "Company Name is required"),
  website: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  contact_email: z.string().email("Invalid email").min(1, "Email is required"),
  phone_number: z.string().optional(),
});

type CompanyInfoValues = z.infer<typeof companyInfoSchema>;

interface Company {
  id: string;
  name: string;
  initial?: string;
}

interface CompanyInfoStepProps {
  companyId?: string | null;
  isUpdateMode?: boolean;
  onNext?: () => void;
  setCompanyId?: (id: string) => void;
  footerAction?: React.ReactNode;
  hideLogoUpload?: boolean;
}

export function CompanyInfoStep({
  companyId,
  isUpdateMode,
  onNext,
  setCompanyId,
  footerAction,
  hideLogoUpload,
}: CompanyInfoStepProps) {
  const { createCompany, updateCompany, uploadLogo } = useCompanyMutations();
  const { data: rawCompanies } = useCompaniesQuery();
  const setTypedCompanyName = useOnboardingStore(
    (state) => state.setTypedCompanyName,
  );

  const companies: Company[] = (rawCompanies ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    initial: c.name.charAt(0).toUpperCase(),
  }));

  const { data: companyData } = useCompanyQuery(
    isUpdateMode ? companyId : null,
  );

  const isCreating = createCompany.isPending;
  const isUpdating = updateCompany.isPending;
  const isUploading = uploadLogo.isPending;

  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CompanyInfoValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      name: companyData?.name || "",
      website: companyData?.website || "",
      industry: companyData?.industry || "",
      company_size: companyData?.company_size || "",
      country: companyData?.country || "",
      timezone: companyData?.timezone || "",
      contact_email: companyData?.contact_email || "",
      phone_number: companyData?.phone_number || "",
    },
  });

  useEffect(() => {
    if (isUpdateMode && companyData) {
      reset({
        name: companyData.name || "",
        website: companyData.website || "",
        industry: companyData.industry || "",
        company_size: companyData.company_size || "",
        country: companyData.country || "",
        timezone: companyData.timezone || "",
        contact_email: companyData.contact_email || "",
        phone_number: companyData.phone_number || "",
      });
    }
  }, [isUpdateMode, companyData, reset]);

  const typedName = watch("name");

  // Sync the typed name to the global Zustand store in real-time
  useEffect(() => {
    setTypedCompanyName(typedName || "");
  }, [typedName, setTypedCompanyName]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default-select the current company or the first one
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      const current = companies.find((c) => c.id === companyId);
      setSelectedCompany(current || companies[0]);
    }
  }, [companies, selectedCompany, companyId]);

  const onSubmit = async (data: CompanyInfoValues) => {
    try {
      let resolvedCompanyId = companyId;

      if (isUpdateMode && companyId) {
        await updateCompany.mutateAsync({
          companyId,
          section: "info",
          payload: data,
        });
      } else {
        const company = await createCompany.mutateAsync({
          ...data,
        });
        resolvedCompanyId = company.id;
        setCompanyId?.(company.id);
      }

      if (logoFile && resolvedCompanyId) {
        await uploadLogo.mutateAsync({
          companyId: resolvedCompanyId,
          file: logoFile,
        });
      }

      onNext?.();
    } catch (error) {
      console.error(error);
      setError(
        isUpdateMode
          ? "Failed to update company info. Please try again."
          : "Failed to create company. Please try again.",
      );
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl pb-4">
      {hideLogoUpload && (
        <div className="mb-8 flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Company Logo"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 overflow-hidden bg-[#FF5722]">
                <div className="absolute -top-2 -left-2 flex items-center justify-center text-[#FF8A65]/50">
                  <div className="flex flex-wrap gap-1 p-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 w-4 rounded-xs bg-current" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-1 bottom-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-50"
            >
              <Icons.pencil className="h-3 w-3 text-gray-900" />
            </button>
          </div>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="font-dm-mono flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">
                {selectedCompany?.initial ?? "?"}
              </span>
              {selectedCompany?.name ?? "Select company"}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform",
                  isDropdownOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="animate-in fade-in slide-in-from-top-2 font-dm-mono absolute left-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white py-1 shadow-xl duration-200">
                <div className="px-3 py-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Switch Company
                </div>
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setSelectedCompany(company);
                      setIsDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6433CC]/10 text-xs font-bold text-[#6433CC]">
                      {company.initial}
                    </div>
                    <span className="font-dm-mono flex-1 text-left font-medium">
                      {company.name}
                    </span>
                    {selectedCompany?.id === company.id && (
                      <Check className="h-4 w-4 text-[#6433CC]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleLogoUpload}
      />

      {!hideLogoUpload && (
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
                    <Icons.logoHolder width="60" height="60" />
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
                      width="129"
                      height="133"
                      viewBox="0 0 129 133"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_891_201)">
                        <rect width="129" height="133" fill="#F25430" />
                        <path
                          d="M10.4561 104.792H21.6318V93H38V109.104H26.8242V120.896H38V137H21.5439V125.208H10.3682V137H-6V120.896H5.17578V109.104H-6V93H10.4561V104.792Z"
                          fill="#F2B035"
                        />
                        <path
                          d="M59.4561 55.792H70.6318V44H87V60.1035H75.8242V71.8965H87V88H70.5439V76.208H59.3682V88H43V71.8965H54.1758V60.1035H43V44H59.4561V55.792Z"
                          fill="#F2B035"
                        />
                        <path
                          d="M1.45605 11.792H12.6318V0H29V16.1035H17.8242V27.8965H29V44H12.5439V32.208H1.36816V44H-15V27.8965H-3.82422V16.1035H-15V0H1.45605V11.792Z"
                          fill="#F2B035"
                        />
                        <path
                          d="M106.456 6.79199H117.632V-5H134V11.1035H122.824V22.8965H134V39H117.544V27.208H106.368V39H90V22.8965H101.176V11.1035H90V-5H106.456V6.79199Z"
                          fill="#F2B035"
                        />
                        <path
                          d="M114.456 110.792H125.632V99H142V115.104H130.824V126.896H142V143H125.544V131.208H114.368V143H98V126.896H109.176V115.104H98V99H114.456V110.792Z"
                          fill="#F2B035"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_891_201">
                          <rect width="129" height="133" rx="10" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-2 bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50"
              >
                <Icons.pencil className="h-4 w-4 text-gray-900" />
              </button>
            </div>
            <div className="font-dm-mono flex flex-col justify-center pt-8">
              <FormLabel>COMPANY LOGO</FormLabel>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#6433CC] px-6 py-2.5 text-sm font-medium text-white font-stretch-50% shadow-[-6px_6px_0px_0px_#000000] transition-colors hover:bg-purple-700"
              >
                UPLOAD
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="font-stolzl grid gap-x-8 gap-y-4 md:grid-cols-2">
        <div className="col-span-1">
          <FormLabel htmlFor="companyName">Company Name</FormLabel>
          <FormInput
            id="companyName"
            placeholder="Company Legal Name"
            {...register("name")}
            className={errors.name ? "ring-2 ring-red-500" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="website">Company Website</FormLabel>
          <FormInput
            id="website"
            placeholder="https://site.com"
            {...register("website")}
          />
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="industry">Industry</FormLabel>
          <FormSelect id="industry" {...register("industry")}>
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
          <FormSelect id="size" {...register("company_size")}>
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
          <FormSelect id="country" {...register("country")}>
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
          <FormSelect id="timezone" {...register("timezone")}>
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
          <FormInput
            id="email"
            type="email"
            placeholder="Botonte@yahoo.com"
            {...register("contact_email")}
            className={errors.contact_email ? "ring-2 ring-red-500" : ""}
          />
          {errors.contact_email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.contact_email.message}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <FormLabel htmlFor="phone">Primary phone number</FormLabel>
          <FormInput
            id="phone"
            type="tel"
            placeholder="+2349057004914"
            {...register("phone_number")}
          />
        </div>
      </div>

      <div className="mt-6">
        <OnboardingErrorToast
          message={error}
          onDismiss={() => setError(null)}
        />
        {footerAction ?? (
          <NextButton
            onClick={handleSubmit(onSubmit)}
            disabled={isCreating || isUpdating || isUploading}
          >
            {isCreating || isUpdating || isUploading ? (
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
