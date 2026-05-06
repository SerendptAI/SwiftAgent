"use client";

import Image from "next/image";

interface ReferScreenThreeProps {
  onBack: () => void;
  onNext: () => void;
}

export function ReferScreenThree({ onBack, onNext }: ReferScreenThreeProps) {
  return (
    <>
      <Image
        src="/images/Referrals/screen-3/coins-left-screen-3.svg"
        alt=""
        width={209}
        height={518}
        aria-hidden="true"
        className="pointer-events-none absolute top-16 -left-20 z-0 w-[150px] opacity-35 sm:w-[180px] md:top-24 md:left-0 md:w-[209px] md:opacity-100"
      />
      <Image
        src="/images/Referrals/screen-3/coins-right-screen-3.svg"
        alt=""
        width={206}
        height={450}
        aria-hidden="true"
        className="pointer-events-none absolute top-24 -right-20 z-0 w-[150px] opacity-35 sm:w-[180px] md:top-32 md:right-0 md:w-[206px] md:opacity-100"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[900px] flex-col items-center justify-center px-5 text-center">
        <h1 className="font-greed-narrow text-[48px] leading-none font-medium text-black uppercase md:text-[64px]">
          Founder contact
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
