import { SetupWizard } from "@/components/dashboard/company-setup/setup-wizard";

export default async function DashboardPage() {
  return (
    <div className="h-full w-full">
      <SetupWizard />
    </div>
  );
}
