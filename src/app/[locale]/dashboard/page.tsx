import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="flex items-center">
      <h1 className="text-2xl font-semibold md:text-2xl">
        {t("welcomeMessage")} (Placeholder)
      </h1>
    </div>
  );
}
