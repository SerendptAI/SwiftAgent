"use client";

import Image from "next/image";

interface ReferScreenFourProps {
  onBack: () => void;
}

export function ReferScreenFour({ onBack }: ReferScreenFourProps) {
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

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[900px] flex-col items-center px-4 pt-[128px] pb-14 text-center sm:px-5 md:pt-[160px] md:pb-20">
        <h1 className="font-greed-narrow text-[48px] leading-none font-medium text-black uppercase md:text-[64px]">
          Confirm referral
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="font-dm-mono mx-auto mt-8 flex h-11 w-full max-w-[540px] shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#F2B035] text-sm leading-none font-medium text-black uppercase shadow-[-3px_4px_0_#000] md:h-9"
        >
          Back
        </button>
      </section>
    </>
  );
}
