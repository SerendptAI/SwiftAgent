"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/** Copy lives in the `refer.intro.rules` catalogue, keyed by id. */
const RULES = [
  "foundersOnly",
  "mustHaveCustomers",
  "listed",
  "unlisted",
  "afterConfirmation",
];

interface ReferScreenOneProps {
  onNext: () => void;
}

export function ReferScreenOne({ onNext }: ReferScreenOneProps) {
  const t = useTranslations("refer.intro");
  return (
    <>
      <Image
        src="/images/Referrals/screen-1/coins-left-screen-1.svg"
        alt=""
        width={209}
        height={534}
        priority
        aria-hidden="true"
        className="pointer-events-none absolute top-8 -left-20 z-0 aspect-260/540 w-[160px] select-none sm:-left-14 sm:w-[200px] md:top-[60px] md:left-0 md:w-[260px] md:opacity-100"
      />
      <Image
        src="/images/Referrals/screen-1/coins-right-screen-1.svg"
        alt=""
        width={299}
        height={422}
        priority
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -right-24 z-0 aspect-300/420 w-[190px] select-none sm:-right-16 sm:w-[230px] md:top-[94px] md:right-0 md:w-[300px] md:opacity-100"
      />
      <Image
        src="/images/Referrals/screen-1/refer_screen_1.svg"
        alt=""
        width={1512}
        height={473}
        aria-hidden="true"
        className="pointer-events-none absolute top-[570px] left-0 z-0 h-auto w-screen max-w-none select-none sm:top-[610px] md:top-[620px]"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col items-center px-4 pt-32 pb-14 text-center sm:px-5 md:pt-40 md:pb-20">
        <h1 className="font-press-start w-full max-w-200 text-center text-2xl leading-relaxed tracking-[-2%] uppercase sm:text-3xl md:text-4xl lg:text-[40px]">
          {t("heading")}
        </h1>

        <p className="mt-8 max-w-140 text-center text-base leading-normal tracking-[2%] text-black/60 sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-10 w-full max-w-[720px] rounded-[28px] border border-black/25 bg-white px-4 pt-7 pb-9 text-center sm:mt-[50px] sm:px-6 md:mt-[57px] md:rounded-[49px] md:px-8 md:pt-9 md:pb-12">
          <h2 className="font-greed text-center text-[26px] leading-relaxed font-semibold tracking-[-2%] md:text-[32px]">
            {t("rulesTitle")}
          </h2>

          <div className="mt-8 flex flex-col gap-5">
            {RULES.map((rule, index) => (
              <div
                key={rule}
                className="flex items-center gap-4 rounded-2xl bg-[#F5F5F5] px-4 py-3.5 sm:px-4.5 md:gap-6"
              >
                <span className="font-greed flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-black text-[26px] leading-[1.34] font-medium tracking-[-0.02em] text-white md:text-[32px]">
                  {index + 1}
                </span>
                <span className="min-w-0 text-left text-sm leading-[1.45] tracking-[2%] sm:text-base md:text-lg md:tracking-[10%] lg:text-xl">
                  {t(`rules.${rule}`)}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onNext}
            className="font-dm-mono mx-auto mt-9 flex h-12 w-full max-w-100 shrink-0 cursor-pointer items-center justify-center gap-4 rounded-md bg-[#F2B035] text-base leading-none font-medium shadow-[-4px_4px_0_#000] md:gap-5"
          >
            {t("continue")}
          </button>

          <a
            href="#terms"
            className="mt-12 inline-block text-xs tracking-[2%] underline underline-offset-4 sm:text-sm"
          >
            {t("terms")}
          </a>
        </div>
      </section>
    </>
  );
}
