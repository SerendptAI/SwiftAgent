import { useTranslations } from "next-intl";

export function ContactHeader() {
  const t = useTranslations("common.contact");

  return (
    <div className="flex flex-col justify-between gap-8 max-md:p-8 md:mb-20 md:flex-row md:items-end">
      <div className="space-y-6 md:space-y-12">
        <p className="inline-block text-base leading-[1.2] tracking-[10%] text-white uppercase md:text-lg">
          {t("eyebrow")}
        </p>
        <h2 className="font-press-start xs:text-4xl text-3xl leading-none font-medium tracking-[-2%] text-white uppercase md:text-5xl lg:text-6xl">
          {t("heading")}
        </h2>
      </div>
    </div>
  );
}
