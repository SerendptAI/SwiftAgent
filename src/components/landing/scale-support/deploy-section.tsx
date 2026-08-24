import { useTranslations } from "next-intl";

import { Icons } from "@/components/icons";

/** Copy lives in the `landing.deploy.points` catalogue, keyed by id. */
const POINTS = ["noProjects", "noEnterpriseSetup", "noWaiting"];

export function DeploySection() {
  const t = useTranslations("landing.deploy");
  return (
    <section className="w-full bg-[#F6F4EF] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-500 uppercase md:text-lg">
              {t("eyebrow")}
            </p>
            <h2 className="font-greed-narrow text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
              {t("heading")}
            </h2>
            <p className="font-stolzl mt-8 max-w-xl text-base leading-relaxed text-black/70 md:text-lg">
              {t("body")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {POINTS.map((point) => (
              <div
                key={point}
                className="flex items-center gap-4 border border-black bg-white px-5 py-6 md:px-6"
              >
                <Icons.CheckCircle className="size-6 shrink-0" />
                <span className="font-stolzl text-base leading-normal tracking-[2%] text-black md:text-lg">
                  {t(`points.${point}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
