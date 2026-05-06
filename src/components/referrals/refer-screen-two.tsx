"use client";

import Image from "next/image";

interface ReferScreenTwoProps {
  onBack: () => void;
  onNext: () => void;
}

export function ReferScreenTwo({ onBack, onNext }: ReferScreenTwoProps) {
  return (
    <>
      <Image
        src="/images/Referrals/screen-2/coins-left-screen-2.svg"
        alt=""
        width={305}
        height={460}
        aria-hidden="true"
        className="pointer-events-none absolute top-16 -left-24 z-0 w-[190px] opacity-35 sm:w-[230px] md:top-24 md:left-0 md:w-[305px] md:opacity-100"
      />
      <Image
        src="/images/Referrals/screen-2/coins-right-screen-2.svg"
        alt=""
        width={327}
        height={450}
        aria-hidden="true"
        className="pointer-events-none absolute top-20 -right-28 z-0 w-[210px] opacity-35 sm:w-[250px] md:top-28 md:right-0 md:w-[327px] md:opacity-100"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[900px] flex-col items-center justify-center px-5 text-center">
        <h1 className="font-greed-narrow text-[48px] leading-none font-medium text-black uppercase md:text-[64px]">
          Referral details
        </h1>
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="font-dm-mono rounded-lg border border-black bg-white px-8 py-3 text-sm font-bold tracking-[0.15em] uppercase shadow-[-3px_3px_0_#000]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="font-dm-mono rounded-lg bg-[#F2B035] px-8 py-3 text-sm font-bold tracking-[0.15em] uppercase shadow-[-3px_3px_0_#000]"
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
}
