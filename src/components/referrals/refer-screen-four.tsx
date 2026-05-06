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
        className="pointer-events-none absolute top-16 -left-32 z-0 w-[240px] opacity-35 sm:w-[300px] md:top-24 md:left-0 md:w-[450px] md:opacity-100"
      />
      <Image
        src="/images/Referrals/screen-4/coins-right-screen-4.svg"
        alt=""
        width={383}
        height={423}
        aria-hidden="true"
        className="pointer-events-none absolute top-24 -right-32 z-0 w-[220px] opacity-35 sm:w-[280px] md:top-32 md:right-0 md:w-[383px] md:opacity-100"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[900px] flex-col items-center justify-center px-5 text-center">
        <h1 className="font-greed-narrow text-[48px] leading-none font-medium text-black uppercase md:text-[64px]">
          Confirm referral
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="font-dm-mono mt-8 rounded-lg border border-black bg-white px-8 py-3 text-sm font-bold tracking-[0.15em] uppercase shadow-[-3px_3px_0_#000]"
        >
          Back
        </button>
      </section>
    </>
  );
}
