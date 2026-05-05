"use client";

import { useState } from "react";

import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  NextButton,
} from "@/components/dashboard/company-setup/ui-elements";
import { Navbar } from "@/components/landing/navbar";
import { useRegisterInterest } from "@/hooks/use-auth";

export default function RegisterCompanyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    size: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const registerInterest = useRegisterInterest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    registerInterest.mutate(
      {
        company_name: form.name.trim(),
        company_email: form.email.trim(),
        company_description: form.description.trim(),
        customer_size: form.size,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (error: unknown) => {
          const data =
            error && typeof error === "object" && "response" in error
              ? (
                  error as {
                    response?: {
                      data?: { message?: string; detail?: string };
                    };
                  }
                ).response?.data
              : undefined;
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
    <div className="min-h-screen bg-[#fffff] p-4 md:p-8">
      <div className="mx-auto w-full max-w-[1280px] overflow-hidden">
        <Navbar />
        {/* Content: two columns */}
        <div className="grid grid-cols-1 gap-6 p-6 pt-[140px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10 md:p-10 md:pt-[180px] lg:gap-14">
          {/* Left: decorative SVG */}
          <div className="relative order-2 md:order-1">
            <div className="relative aspect-528/724 w-full overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  submitted
                    ? "/images/completeregisteration.svg"
                    : "/images/registercompany.svg"
                }
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right: form */}
          <div className="order-1 md:order-2">
            {submitted ? (
              <div className="flex flex-col items-center gap-8">
                <aside className="text-center">
                  <h1 className="font-greed-narrow text-4xl leading-[1.05] tracking-tight text-gray-900 uppercase md:text-5xl lg:text-6xl">
                    Thank you for
                    <br />
                    registering!
                  </h1>
                  <p className="font-stolzl mt-4 text-xs tracking-[0.2em] text-gray-900 uppercase">
                    we’ll reach out soon!
                  </p>
                </aside>
                <aside>
                  <img
                    src="/images/Thankyou.svg"
                    alt=""
                    className="h-auto w-[140px] md:w-[180px]"
                  />
                </aside>
              </div>
            ) : (
              <>
                <h1 className="font-greed-narrow text-4xl leading-[1.05] tracking-tight text-gray-900 uppercase md:text-5xl lg:text-6xl">
                  SWIFT AGENTS
                  <br />
                  REGISTRATION FORM
                </h1>

                <form
                  onSubmit={handleSubmit}
                  className="font-stolzl mt-8 flex flex-col gap-5"
                >
                  <div>
                    <FormLabel htmlFor="companyName">Company Name</FormLabel>
                    <FormInput
                      id="companyName"
                      placeholder="Company Legal Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, size: e.target.value })
                      }
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
                    <p className="font-stolzl text-sm text-red-600">
                      {submitError}
                    </p>
                  )}

                  <NextButton
                    type="submit"
                    className="mt-2 uppercase disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={registerInterest.isPending}
                  >
                    {registerInterest.isPending ? "Submitting..." : "Register"}
                  </NextButton>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
