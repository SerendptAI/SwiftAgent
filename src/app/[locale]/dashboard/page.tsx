import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { ResourcesCard } from "@/components/dashboard/overview/resources-card";
import { StatsCards } from "@/components/dashboard/overview/stats-cards";
import { VisitorsList } from "@/components/dashboard/overview/visitors-list";
import { WidgetCard } from "@/components/dashboard/overview/widget-card";

export default function DashboardPage() {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Column - Stats Grid */}
        <div className="flex-1">
          <CompanyToolbar />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatsCards />
            <ResourcesCard />
          </div>
        </div>

        {/* Right Column - Widget & Visitors */}
        <div className="w-full space-y-6 lg:w-[350px]">
          <WidgetCard />
          <VisitorsList />
        </div>
      </div>
    </div>
  );
}
