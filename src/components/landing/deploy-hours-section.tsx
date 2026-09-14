import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

const POINTS = ["noProjects", "noEnterpriseSetup", "noWaiting"];

export function DeployHoursSection() {
  const t = useTranslations("home.deployHours");

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h2 className="font-greed text-4xl leading-[1.42] font-semibold tracking-[-2%] whitespace-pre-line text-black capitalize md:text-5xl">
            {t("heading")}
          </h2>

          <p className="max-w- text-base leading-normal">{t("body")}</p>
        </div>

        <div className="flex flex-col gap-4">
          {POINTS.map((point) => (
            <div key={point} className="flex items-center gap-4">
              <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-[#03A84E]">
                <Check className="size-3 text-white" strokeWidth={3} />
              </span>
              <span className="text-base">{t(`points.${point}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
