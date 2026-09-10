import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

const POINTS = ["noProjects", "noEnterpriseSetup", "noWaiting"];

export function DeployHoursSection() {
  const t = useTranslations("home.deployHours");

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="font-dm-mono text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:text-[32px]">
            {t("heading")}
          </p>
          <p className="font-stolzl max-w-3xl text-base leading-relaxed text-black">
            {t("body")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {POINTS.map((point) => (
            <div key={point} className="flex items-center gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#03A84E]">
                <Check className="size-3 text-white" strokeWidth={3} />
              </span>
              <span className="font-stolzl text-base text-black">
                {t(`points.${point}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
