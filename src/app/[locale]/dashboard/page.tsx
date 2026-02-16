import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="flex h-full w-full items-center rounded-2xl bg-red-500">
      <h1 className="text-2xl font-semibold md:text-2xl">
        {t("welcomeMessage")} (Placeholder)
      </h1>
    </div>
  );
}
