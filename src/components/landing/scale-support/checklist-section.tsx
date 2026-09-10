import { useTranslations } from "next-intl";

import { Icons } from "@/components/icons";

/** Copy lives in the `landing.checklist.items` catalogue, keyed by id. */
const CHECKLIST = ["repetitive", "responseTimes", "experiences", "scale"];

export function ChecklistSection() {
  const t = useTranslations("landing.checklist");
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <div className="mb-10 md:mb-14">
          <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-400 uppercase md:text-lg">
            {t("eyebrow")}
          </p>
          <h2 className="font-greed-narrow max-w-240 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            {t("heading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {CHECKLIST.map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 border border-black px-5 py-6 md:px-6 md:py-7"
            >
              <Icons.CheckCircle className="size-6 shrink-0" />
              <span className="font-stolzl text-base leading-normal tracking-[2%] text-black md:text-lg">
                {t(`items.${item}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
