"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  NextButton,
} from "@/components/dashboard/company-setup/ui-elements";
import { Navbar } from "@/components/landing/navbar";

export default function RegisterCompanyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    size: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to company creation API
  };

  return (
    <div className="min-h-screen bg-[#fffff] p-4 md:p-8">
      <div className="mx-auto w-full max-w-[1280px] overflow-hidden">
        <Navbar />
        {/* Content: two columns */}
        <div className="grid grid-cols-1 gap-6 p-6 pt-[140px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10 md:p-10 md:pt-[180px] lg:gap-14">
          {/* Left: decorative SVG */}
          <div className="relative order-2 md:order-1">
            <div className="relative aspect-[528/724] w-full overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/registercompany.svg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right: form */}
          <div className="order-1 md:order-2">
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
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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

              <NextButton type="submit" className="mt-2 uppercase">
                Register
              </NextButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
