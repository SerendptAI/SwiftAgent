import { useTranslations } from "next-intl";

/* eslint-disable @next/next/no-img-element */
import { DemoBookingLink } from "../demo-booking-link";

export function CtaPanel() {
  const t = useTranslations("demo.cta");

  return (
    <div className="relative isolate mt-8 overflow-hidden bg-[#F6F4EF] px-6 py-8 md:px-10 lg:px-14 lg:py-12">
      <img
        alt=""
        src="/images/demo-mascot-bg.svg"
        className="absolute right-0 bottom-0 -z-1"
      />

      <div className="relative">
        <p className="mb-4 text-base leading-[1.2] tracking-[2%] text-black/60 uppercase md:text-lg">
          SUPPORT AGENTS YOU DON&apos;T NEED TO HIRE
        </p>

        <h2 className="font-greed mb-8 text-3xl leading-[1.34] font-medium tracking-[-2%] text-black capitalize md:text-4xl lg:text-[46px]">
          {t("heading")}
        </h2>

        <p className="mb-15 max-w-2xl text-base leading-[1.76] tracking-[2%] text-black">
          <strong>{t("bodyLead")}</strong>
          {t("bodyRest")}
        </p>

        <div className="flex w-full max-w-319 flex-col items-start gap-4 bg-[#F2B035] p-5 shadow-[-4px_4px_0px_0px_#000000] sm:justify-between sm:gap-8 md:pr-7 md:pl-10 lg:flex-row lg:items-center">
          <p className="text-base leading-[1.6] tracking-[2%] text-black/80 md:text-lg">
            {t("strip")}
          </p>
          <DemoBookingLink
            location="roi-simulator"
            className="font-greed w-full shrink-0 border border-black bg-white p-3 text-center text-3xl leading-[1.34] font-medium tracking-[-2%] text-black shadow-[-4px_4px_0px_0px_#000000] transition-shadow sm:max-w-101 md:p-5 md:text-4xl lg:text-[46px]"
          >
            {t("bookDemo")}
          </DemoBookingLink>
        </div>
      </div>
    </div>
  );
}
