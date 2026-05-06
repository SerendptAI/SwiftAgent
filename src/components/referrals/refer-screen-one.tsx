"use client";

import Image from "next/image";

const RULES = [
  "REFER CEO'S AND FOUNDERS ONLY",
  "REFERRED BUSINESSES MUST HAVE CUSTOMERS",
  "LISTED START UPS ARE WORTH 10,000 NGN.",
  "UNLISTED START UPS ARE WORTH 5,000 NGN.",
  "FUNDS ARE RELEASED AFTER IDENTITY CONFIRMATION",
];

interface ReferScreenOneProps {
  onNext: () => void;
}

export function ReferScreenOne({ onNext }: ReferScreenOneProps) {
  return (
    <>
      <Image
        src="/images/Referrals/screen-1/coins-left-screen-1.svg"
        alt=""
        width={209}
        height={534}
        priority
        aria-hidden="true"
        className="pointer-events-none absolute top-[52px] -left-20 z-0 aspect-260/540 w-[160px] opacity-35 select-none sm:-left-14 sm:w-[200px] md:top-[60px] md:left-0 md:w-[260px] md:opacity-100"
      />
      <Image
        src="/images/Referrals/screen-1/coins-right-screen-1.svg"
        alt=""
        width={299}
        height={422}
        priority
        aria-hidden="true"
        className="pointer-events-none absolute top-[66px] -right-24 z-0 aspect-300/420 w-[190px] opacity-35 select-none sm:-right-16 sm:w-[230px] md:top-[94px] md:right-0 md:w-[300px] md:opacity-100"
      />
      <Image
        src="/images/Referrals/screen-1/refer_screen_1.svg"
        alt=""
        width={1512}
        height={473}
        aria-hidden="true"
        className="pointer-events-none absolute top-[570px] left-0 z-0 h-auto w-screen max-w-none select-none sm:top-[610px] md:top-[620px]"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col items-center px-4 pt-[128px] pb-14 text-center sm:px-5 md:pt-[160px] md:pb-20">
        <h1 className="font-greed-narrow w-full max-w-[700px] text-center text-[42px] leading-[1.08] font-medium tracking-[-0.02em] text-black uppercase sm:text-[52px] md:text-[60px] md:leading-[1.34]">
          Refer a founder and win challenge
        </h1>

        <p className="font-dm-mono mt-[30px] max-w-[760px] text-center text-base leading-[1.45] tracking-[0.08em] text-black/60 uppercase sm:text-lg sm:leading-[1.39] sm:tracking-widest">
          We&apos;re looking to connect with a few founders to use Swift Agents
        </p>

        <div className="mt-[42px] w-full max-w-[720px] rounded-[28px] border border-black/25 bg-white px-4 pt-7 pb-9 text-center sm:mt-[50px] sm:px-6 md:mt-[57px] md:rounded-[49px] md:px-8 md:pt-9 md:pb-12">
          <h2 className="font-greed-narrow text-center text-[32px] leading-[1.34] font-medium tracking-[-0.02em] text-black uppercase">
            Rules
          </h2>

          <div className="mt-8 flex flex-col gap-5">
            {RULES.map((rule, index) => (
              <div
                key={rule}
                className="flex items-center gap-4 rounded-2xl bg-[#F5F5F5] px-4 py-3.5 sm:px-4.5 md:gap-6"
              >
                <span className="font-greed-narrow flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-black text-[32px] leading-[1.34] font-medium tracking-[-0.02em] text-white uppercase">
                  {index + 1}
                </span>
                <span className="font-dm-mono min-w-0 text-left text-sm leading-[1.45] tracking-[0.08em] text-black uppercase sm:text-base md:text-lg md:leading-[1.39] md:tracking-widest">
                  {rule}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onNext}
            className="font-dm-mono mx-auto mt-9 flex h-11 w-full max-w-[540px] shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#F2B035] text-sm leading-none font-medium text-black uppercase shadow-[-3px_4px_0_#000] md:h-9"
          >
            Continue
          </button>

          <a
            href="#terms"
            className="font-dm-mono mt-[46px] inline-block text-xs tracking-[0.08em] text-black uppercase underline underline-offset-4 sm:text-sm"
          >
            Terms and conditions apply
          </a>
        </div>
      </section>
    </>
  );
}
