"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { SERVICE_COMPANIES } from "./referral-companies";

interface ReferScreenTwoProps {
  onBack: () => void;
  onNext: () => void;
}

export function ReferScreenTwo({ onBack, onNext }: ReferScreenTwoProps) {
  const t = useTranslations("refer.companies");
  const [activeTab, setActiveTab] = useState<"service" | "crypto">("service");

  return (
    <>
      <Image
        src="/images/Referrals/screen-2/coins-left-screen-2.svg"
        alt=""
        width={305}
        height={460}
        aria-hidden="true"
        className="pointer-events-none absolute top-8 -left-16 z-0 w-[190px] sm:w-[230px] md:top-21 md:left-0 md:w-[305px]"
      />
      <Image
        src="/images/Referrals/screen-2/coins-right-screen-2.svg"
        alt=""
        width={327}
        height={450}
        aria-hidden="true"
        className="pointer-events-none absolute top-6 -right-24 z-0 w-[210px] sm:w-[250px] md:top-20 md:right-0 md:w-[327px]"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col items-center px-4 pt-[128px] pb-16 text-center sm:px-5 md:pt-[160px] md:pb-24">
        <h1 className="font-press-start w-full max-w-4xl text-center text-2xl leading-relaxed tracking-[-2%] uppercase sm:text-3xl md:text-4xl lg:text-[40px]">
          {t("heading")}
        </h1>

        <p className="mt-8 max-w-4xl text-center text-base leading-normal tracking-[2%] text-black/60 sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-10.5 grid w-fit grid-cols-1 gap-2 sm:grid-cols-2 md:mt-14 md:gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("service")}
            aria-pressed={activeTab === "service"}
            className={`flex h-12 w-full cursor-pointer items-center justify-center gap-4 rounded-[10px] px-5 py-2.5 text-lg leading-snug font-medium tracking-[2%] capitalize ${
              activeTab === "service"
                ? "bg-[#F2B035] text-black"
                : "bg-[#F2F1EE] opacity-60"
            }`}
          >
            <Image
              src="/images/Referrals/icons/chess-rook.svg"
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
              className="size-6 shrink-0"
            />
            {t("serviceTab")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("crypto")}
            aria-pressed={activeTab === "crypto"}
            className={`flex h-12 w-full cursor-pointer items-center justify-center gap-4 rounded-[10px] px-5 py-2.5 text-lg leading-snug font-medium tracking-[2%] capitalize ${
              activeTab === "crypto"
                ? "bg-[#F2B035] text-black"
                : "bg-[#F2F1EE] text-black opacity-60"
            }`}
          >
            <Image
              src="/images/Referrals/icons/chess-knight.svg"
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
              className={`size-6 shrink-0 ${
                activeTab === "crypto" ? "" : "opacity-60"
              }`}
            />
            {t("cryptoTab")}
          </button>
        </div>

        {activeTab === "service" ? (
          <div className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:mt-22 md:gap-6 lg:grid-cols-4 lg:gap-8">
            {SERVICE_COMPANIES.map((company) => (
              <div
                key={company.name}
                className="flex h-14 w-full items-center gap-5 rounded-xl bg-[#F2F1EE] px-5 shadow-[-4px_4px_0_#000]"
              >
                <Image
                  src={`/images/Referrals/logos/${company.logo}`}
                  alt=""
                  width={44}
                  height={44}
                  className="aspect-square w-full max-w-8.5 shrink-0 object-contain object-center"
                />
                <span className="min-w-0 truncate text-left text-base leading-none font-medium tracking-[2%] capitalize sm:text-lg">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-20 min-h-[620px] w-full" aria-hidden="true" />
        )}

        <div className="mt-16 w-full md:mt-22">
          <button
            type="button"
            onClick={onNext}
            className="mx-auto flex h-12 w-full max-w-100 shrink-0 cursor-pointer items-center justify-center gap-4 rounded-md bg-[#F2B035] text-base leading-none font-medium text-black capitalize shadow-[-4px_4px_0_#000] md:gap-5"
          >
            <Image
              src="/images/Referrals/icons/hand-holding-coin.svg"
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
              className="size-5.5 shrink-0"
            />
            {t("referCta")}
          </button>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-8 cursor-pointer text-sm tracking-[0.08em] text-black/50 underline underline-offset-4 md:text-base"
        >
          Back
        </button>
      </section>
    </>
  );
}
