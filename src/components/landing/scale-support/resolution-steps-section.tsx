import { useTranslations } from "next-intl";

/** Copy lives in the `landing.steps.items` catalogue, keyed by id. */
const STEPS = [
  { id: "connect", number: "1", accent: "#F2B035" },
  { id: "train", number: "2", accent: "#03A84E" },
  { id: "goLive", number: "3", accent: "#F25430" },
];

export function ResolutionStepsSection() {
  const t = useTranslations("landing.steps");
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <div className="mb-10 md:mb-14">
          <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-400 uppercase md:text-lg">
            {t("eyebrow")}
          </p>
          <h2 className="font-greed-narrow max-w-280 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            {t("heading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="flex flex-col gap-5 border border-black px-5 py-7 md:px-6 md:py-8"
            >
              <span
                className="font-greed-narrow flex size-12 shrink-0 items-center justify-center rounded-full text-2xl font-medium text-white"
                style={{ backgroundColor: step.accent }}
              >
                {step.number}
              </span>
              <h3 className="font-dm-mono text-lg leading-normal font-medium tracking-[8%] text-black uppercase md:text-xl">
                {t(`items.${step.id}.title`)}
              </h3>
              <p className="font-stolzl text-sm leading-normal tracking-[2%] text-black/70 md:text-base">
                {t(`items.${step.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
