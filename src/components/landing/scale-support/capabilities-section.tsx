import { useTranslations } from "next-intl";

/** Copy lives in the `landing.capabilities.items` catalogue, keyed by id. */
const CAPABILITIES = [
  { id: "instantSupport" },
  { id: "productGuidance" },
  { id: "paymentSupport" },
  { id: "knowledgeSearch" },
];

export function CapabilitiesSection() {
  const t = useTranslations("landing.capabilities");
  return (
    <section className="w-full bg-[#F6F4EF] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <div className="mb-10 md:mb-14">
          <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-500 uppercase md:text-lg">
            {t("eyebrow")}
          </p>
          <h2 className="font-greed-narrow max-w-280 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            {t("heading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CAPABILITIES.map((capability) => (
            <div
              key={capability.id}
              className="flex flex-col gap-3 border border-black bg-white px-5 py-7 md:px-6 md:py-8"
            >
              <h3 className="font-greed-narrow text-2xl leading-[1.2] font-medium tracking-[-2%] text-black uppercase md:text-3xl">
                {t(`items.${capability.id}.title`)}
              </h3>
              <p className="font-stolzl text-sm leading-normal tracking-[2%] text-black/70 md:text-base">
                {t(`items.${capability.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
