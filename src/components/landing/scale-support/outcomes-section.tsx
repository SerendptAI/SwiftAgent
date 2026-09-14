import { useTranslations } from "next-intl";

/** Copy lives in the `landing.outcomes.items` catalogue, keyed by id. */
const OUTCOMES = [
  "fasterResponses",
  "lessManualWork",
  "experiences",
  "lowerCosts",
];

export function OutcomesSection() {
  const t = useTranslations("landing.outcomes");
  return (
    <section className="w-full bg-[#6433CC] px-6 py-16 text-white md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <p className="mb-4 text-base leading-[1.2] tracking-[10%] text-white/60 uppercase md:text-lg">
          {t("eyebrow")}
        </p>

        <h2 className="font-greed max-w-280 text-4xl leading-[1.34] font-medium tracking-[-2%] uppercase md:text-5xl lg:text-[66px]">
          {t("heading")}
        </h2>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/80 md:mt-10 md:text-lg">
          {t("body")}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {OUTCOMES.map((outcome) => (
            <div
              key={outcome}
              className="border border-white/30 px-5 py-6 text-center"
            >
              <span className="text-sm tracking-[8%] uppercase md:text-base">
                {t(`items.${outcome}`)}
              </span>
            </div>
          ))}
        </div>

        <p className="font-greed mt-12 max-w-2xl text-2xl leading-[1.4] font-medium tracking-[-2%] uppercase md:mt-16 md:text-3xl lg:text-4xl">
          This isn&apos;t another support tool. It&apos;s a customer support
          automation system.
        </p>
      </div>
    </section>
  );
}
