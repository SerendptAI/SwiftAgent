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
        <h1 className="font-greed-narrow w-full max-w-[700px] text-center text-[42px] leading-[1.08] font-medium tracking-[-0.02em] text-black uppercase sm:text-[52px] md:text-[60px] md:leading-[1.34]">
          {t("heading")}
        </h1>

        <p className="font-dm-mono mt-[30px] max-w-[790px] text-center text-base leading-[1.45] tracking-[0.08em] text-black/60 uppercase sm:text-lg sm:leading-[1.39] sm:tracking-widest">
          {t("subtitle")}
        </p>

        <div className="mt-10.5 grid w-fit grid-cols-1 gap-2 sm:grid-cols-2 md:mt-14 md:gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("service")}
            aria-pressed={activeTab === "service"}
            className={`font-dm-mono flex h-12 w-full cursor-pointer items-center justify-center gap-4 rounded-[10px] px-5 py-2.5 text-lg leading-[22px] font-medium uppercase ${
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
              className="size-7 shrink-0"
            />
            {t("serviceTab")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("crypto")}
            aria-pressed={activeTab === "crypto"}
            className={`font-dm-mono flex h-12 w-full cursor-pointer items-center justify-center gap-4 rounded-[10px] px-5 py-2.5 text-lg leading-[22px] font-medium uppercase ${
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
              className={`size-7 shrink-0 ${
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
                className="flex h-14 w-full items-center gap-5 rounded-xl bg-[#F2F1EE] px-5 shadow-[-3px_4px_0_#000]"
              >
                <Image
                  src={`/images/Referrals/logos/${company.logo}`}
                  alt=""
                  width={44}
                  height={44}
                  className="aspect-square w-full max-w-8.5 shrink-0 object-contain object-center"
                />
                <span className="font-dm-mono min-w-0 truncate text-left text-base leading-none font-medium tracking-[0.04em] text-black uppercase sm:text-lg">
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
            className="font-dm-mono mx-auto flex h-11 w-full max-w-[440px] shrink-0 cursor-pointer items-center justify-center gap-4 rounded-md bg-[#F2B035] text-base leading-none font-medium text-black uppercase shadow-[-3px_4px_0_#000] md:gap-5"
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
          className="font-dm-mono mt-8 cursor-pointer text-sm tracking-[0.08em] text-black/50 uppercase underline underline-offset-4 md:text-base"
        >
          Back
        </button>
      </section>
    </>
  );
}
