import { useTranslations } from "next-intl";

export function DemoHeroSection() {
  const t = useTranslations("demo.hero");

  return (
    <div className="space-y-6">
      <p className="text-base leading-[1.2] tracking-[2%] text-black/50 uppercase md:text-lg">
        {t("eyebrow")}
      </p>

      <h1 className="font-greed text-4xl leading-[1.42] font-semibold tracking-[-2%] whitespace-pre-line text-black capitalize md:text-5xl">
        {t("heading")}
      </h1>

      <p className="max-w-148 text-sm leading-normal tracking-[2%] text-black/80 sm:text-base">
        {t("body")}
      </p>
    </div>
  );
}
