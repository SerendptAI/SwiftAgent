import { useTranslations } from "next-intl";

export function DemoHeroSection() {
  const t = useTranslations("demo.hero");

  return (
    <div>
      <p className="font-dm-mono mb-2 text-base leading-[1.2] tracking-[10%] text-black/60 uppercase md:mb-6 md:text-lg">
        {t("eyebrow")}
      </p>
      <h1 className="font-greed mb-4 max-w-2xl text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase sm:text-5xl md:mb-6 md:text-[56px] lg:text-[66px]">
        {t("heading")}
      </h1>
      <p className="font-stolzl max-w-148 text-sm leading-normal tracking-[2%] text-black/80 sm:text-base">
        {t("body")}
      </p>
    </div>
  );
}
