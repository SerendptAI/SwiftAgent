import { useTranslations } from "next-intl";

export function ContactHeader() {
  const t = useTranslations("common.contact");

  return (
    <div className="flex flex-col justify-between gap-8 max-md:p-8 md:mb-20 md:flex-row md:items-end">
      <div className="space-y-6">
        <span className="inline-block font-mono text-base leading-[1.2] tracking-[10%] text-white uppercase md:text-lg">
          {t("eyebrow")}
        </span>
        <h2 className="font-greed-narrow xs:text-6xl text-5xl leading-none font-medium tracking-[-2%] text-white md:text-7xl lg:text-8xl">
          {t("heading")}
        </h2>
      </div>
    </div>
  );
}
