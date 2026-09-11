"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const expectedAmount: "10,000" | "5,000" = "10,000";
const amountColorByValue = {
  "10,000": "bg-[#6433CC]",
  "5,000": "bg-[#F2B035]",
} as const;
const amountColor = amountColorByValue[expectedAmount];

export function ReferScreenFour() {
  const t = useTranslations("refer.done");
  return (
    <>
      <Image
        src="/images/Referrals/screen-4/coins-left-screen-4.svg"
        alt=""
        width={450}
        height={493}
        aria-hidden="true"
        className="pointer-events-none absolute top-[39px] -left-32 z-0 w-[240px] sm:w-[300px] md:top-[78px] md:left-0 md:w-[450px] md:opacity-100"
      />
      <Image
        src="/images/Referrals/screen-4/coins-right-screen-4.svg"
        alt=""
        width={383}
        height={423}
        aria-hidden="true"
        className="pointer-events-none absolute top-[54px] -right-32 z-0 w-[220px] sm:w-[280px] md:top-27 md:right-0 md:w-[383px] md:opacity-100"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col items-center px-4 pt-[128px] pb-16 text-center sm:px-5 md:pt-[160px] md:pb-24">
        <div className="mt-[42px] w-full max-w-[842px] rounded-[28px] border border-black/25 bg-white px-4 pt-18 pb-12 text-center sm:mt-[50px] sm:px-6 md:mt-[230px] md:rounded-[49px] md:px-8 md:pt-24 md:pb-20">
          <h1 className="font-greed w-full text-center text-[42px] leading-[1.08] font-medium tracking-[-0.02em] text-black uppercase sm:text-[52px] md:text-[60px] md:leading-[1.34]">
            {t("heading")}
          </h1>

          <p className="font-dm-mono mx-auto mt-[30px] max-w-[663px] text-center text-base leading-[1.45] tracking-[0.08em] text-black/60 uppercase sm:text-lg sm:leading-[1.39] sm:tracking-widest">
            {t("body")}
          </p>

          <div
            className={cn(
              "mx-auto mt-12 flex w-full max-w-[442px] items-center gap-4 overflow-hidden rounded-[10px] py-2.5 pr-3 pl-3 text-white sm:items-center sm:justify-between sm:gap-8 md:pr-14",
              amountColor,
            )}
          >
            <span
              className={cn(
                "font-dm-mono shrink-0 rounded-[13px] px-3 py-2.5 text-xs leading-none font-medium tracking-[0.12em] uppercase sm:text-sm lg:text-base",
                expectedAmount === "5,000" ? "bg-[#D49A2D]" : "bg-[#804AF3]",
              )}
            >
              {t("expectedLabel")}
            </span>
            <span className="font-dm-mono shrink-0 text-sm leading-none tracking-[0.12em] uppercase sm:text-base lg:text-lg">
              {expectedAmount} NGN
            </span>
          </div>

          <Image
            src="/images/Referrals/screen-4/pixel-life-8.svg"
            alt=""
            width={510}
            height={510}
            aria-hidden="true"
            className="mx-auto mt-16 w-full max-w-[420px] select-none md:max-w-[510px]"
          />

          <p className="font-dm-mono mx-auto mt-16 max-w-[540px] text-center text-sm leading-[1.45] tracking-[0.08em] text-black/60 uppercase sm:text-base sm:leading-[1.39] sm:tracking-widest">
            {t("signoff")}
          </p>
        </div>
      </section>
    </>
  );
}
