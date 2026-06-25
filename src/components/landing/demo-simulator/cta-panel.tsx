/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

export function CtaPanel() {
  return (
    <div className="relative isolate mt-8 overflow-hidden bg-[#F6F4EF] px-6 py-8 md:px-10 lg:px-14 lg:py-12">
      {/* Decorative robot illustration */}
      <img
        alt=""
        src="/images/demo-mascot-bg.svg"
        className="absolute right-0 bottom-0 -z-1"
      />

      <div className="relative">
        {/* Label */}
        <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-black/60 uppercase md:text-lg">
          SUPPORT AGENTS YOU DON&apos;T NEED TO HIRE
        </p>

        {/* Heading */}
        <h2 className="font-greed-narrow mb-8 text-3xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-4xl lg:text-[46px]">
          SWIFT AGENTS DOESN&apos;T JUST REDUCE COST — IT REMOVES THE NEED TO
          SCALE YOUR SUPPORT TEAM.
        </h2>

        {/* Body */}
        <p className="font-stolzl mb-15 max-w-138 text-base leading-[1.76] tracking-[2%] text-black">
          <strong>Without automation,</strong> support grows linearly with your
          customer base. Every 1,200 new tickets = one more hire, one more
          onboarding, one more manager headache.
        </p>

        {/* CTA strip */}
        <div className="flex w-full max-w-319 flex-col items-start gap-4 bg-[#F2B035] p-5 shadow-[-4px_4px_0px_0px_#000000] sm:justify-between sm:gap-8 md:pr-7 md:pl-10 lg:flex-row lg:items-center">
          <p className="font-dm-mono text-base leading-[1.6] tracking-[10%] text-black/80 uppercase md:text-lg">
            DEPLOY A SWIFTAGENTS AI AGENT IN UNDER A DAY.
          </p>
          <Link
            href="/demo"
            className="font-greed-narrow w-full shrink-0 border border-black bg-white p-3 text-center text-3xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase shadow-[-3px_3px_0px_0px_#000000] transition-shadow sm:max-w-101 md:p-5 md:text-4xl lg:text-[46px]"
          >
            BOOK A DEMO
          </Link>
        </div>
      </div>
    </div>
  );
}
