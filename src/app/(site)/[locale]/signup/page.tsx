"use client";

import { useState } from "react";

import { OtpVerification } from "@/components/auth/otp-verification";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  NextButton,
} from "@/components/dashboard/company-setup/ui-elements";
import { Navbar } from "@/components/landing/navbar";
import { useRegisterInterest } from "@/hooks/use-auth";
import { useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { isValidWebsiteUrl, normalizeWebsiteUrl } from "@/lib/website-url";

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    size: "",
    website: "",
  });
  // Registration creates the account and emails the code in one call, so the
  // form hands straight over to code entry — there is no approval to wait on.
  const [step, setStep] = useState<"form" | "otp">("form");
  const [submitError, setSubmitError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const registerInterest = useRegisterInterest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setWebsiteError("");

    // The website drives the approval-time scrape that prefills onboarding, so
    // it is worth rejecting a typo here rather than shipping a dead URL.
    if (!form.website.trim()) {
      setWebsiteError("Company website is required");
      return;
    }
    if (!isValidWebsiteUrl(form.website)) {
      setWebsiteError("Enter a valid website, e.g. acme.com");
      return;
    }

    registerInterest.mutate(
      {
        company_name: form.name.trim(),
        company_email: form.email.trim(),
        company_description: form.description.trim(),
        customer_size: form.size,
        company_website: normalizeWebsiteUrl(form.website),
      },
      {
        onSuccess: () => {
          trackEvent("signup_interest_submitted", {
            customer_size: form.size,
          });
          setStep("otp");
        },
        onError: (error: unknown) => {
          const response =
            error && typeof error === "object" && "response" in error
              ? (
                  error as {
                    response?: {
                      status?: number;
                      data?: { message?: string; detail?: string };
                    };
                  }
                ).response
              : undefined;

          // The endpoint is rate-limited to 5 requests/hour per IP.
          if (response?.status === 429) {
            setSubmitError(
              "You've submitted too many requests. Please try again in an hour.",
            );
            return;
          }

          const data = response?.data;
          setSubmitError(
            data?.message ||
              data?.detail ||
              "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="font-jetbrains min-h-screen bg-[#fffff] p-4 md:p-8">
      <div className="mx-auto w-full max-w-[1280px] overflow-hidden">
        <Navbar />
        <div className="flex flex-col items-center gap-6 p-6 pt-[140px] md:gap-10 md:p-10 md:pt-[180px]">
          {step === "otp" ? (
            <div className="flex flex-col items-center gap-10">
              <aside className="text-center">
                <h1 className="font-press-start w-full max-w-4xl text-center text-2xl leading-relaxed tracking-[-2%] uppercase md:text-3xl">
                  Verify your email
                </h1>
                <p className="mt-8 max-w-4xl text-center text-base leading-normal tracking-[2%] text-black/60 sm:text-lg">
                  We sent a code to {form.email.trim()}
                </p>
              </aside>

              <OtpVerification
                email={form.email.trim()}
                onVerified={() => {
                  trackEvent("login_completed", { method: "email" });
                  router.push("/onboarding");
                }}
                onChangeEmail={() => setStep("form")}
              />
            </div>
          ) : (
            <div className="w-full max-w-xl">
              <h1 className="font-press-start w-full max-w-4xl text-center text-2xl leading-relaxed tracking-[-2%] uppercase sm:text-3xl md:text-4xl lg:text-[40px]">
                Register
              </h1>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-5"
              >
                <div>
                  <FormLabel htmlFor="companyName">Company Name</FormLabel>
                  <FormInput
                    id="companyName"
                    placeholder="Company Legal Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <FormLabel htmlFor="companyEmail">Company Email</FormLabel>
                  <FormInput
                    id="companyEmail"
                    type="email"
                    placeholder="Company@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <FormLabel htmlFor="companyWebsite">
                    Company Website
                  </FormLabel>
                  <FormInput
                    id="companyWebsite"
                    placeholder="acme.com"
                    value={form.website}
                    onChange={(e) => {
                      setWebsiteError("");
                      setForm({ ...form, website: e.target.value });
                    }}
                    className={websiteError ? "ring-2 ring-red-500" : ""}
                    required
                  />
                  {websiteError && (
                    <p className="mt-1 text-sm text-red-600">{websiteError}</p>
                  )}
                </div>

                <div>
                  <FormLabel htmlFor="companyDescription">
                    What does your company do
                  </FormLabel>
                  <FormTextarea
                    id="companyDescription"
                    placeholder="Brief description of what your company does"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <FormLabel htmlFor="customerSize">
                    Estimated/customer size or Average customer size
                  </FormLabel>
                  <FormSelect
                    id="customerSize"
                    className="[&_option]:text-black"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                  >
                    <option value="" disabled>
                      Select customer size
                    </option>
                    <option value="1-100">1 – 100</option>
                    <option value="101-1000">101 – 1,000</option>
                    <option value="1001-10000">1,001 – 10,000</option>
                    <option value="10001-100000">10,001 – 100,000</option>
                    <option value="100000+">100,000+</option>
                  </FormSelect>
                </div>

                {submitError && (
                  <p className="text-sm text-red-600">{submitError}</p>
                )}

                <NextButton
                  type="submit"
                  className="mt-2 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={registerInterest.isPending}
                >
                  {registerInterest.isPending ? "Submitting..." : "Register"}
                </NextButton>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
