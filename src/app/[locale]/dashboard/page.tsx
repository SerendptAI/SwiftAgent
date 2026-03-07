import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { ResourcesCard } from "@/components/dashboard/overview/resources-card";
import { StatsCards } from "@/components/dashboard/overview/stats-cards";
import { VisitorsList } from "@/components/dashboard/overview/visitors-list";
import { WidgetCard } from "@/components/dashboard/overview/widget-card";
import { getServerApiClient } from "@/lib/api-server";
import {
  DashboardStats,
  DashboardVisitor,
  DashboardWidget,
} from "@/services/dashboard";

export default async function DashboardPage() {
  // 1. Get server-side API client
  const api = await getServerApiClient();

  let initialStats: DashboardStats | null = null;
  let initialVisitors: DashboardVisitor[] = [];
  let initialWidget: DashboardWidget | null = null;

  try {
    // This is a placeholder for actual logic to get companyId on server
    const { data: user } = await api.get("/api/v1/auth/me");
    const companyId = user.company_id;

    if (companyId) {
      const [statsRes, visitorsRes, widgetRes] = await Promise.all([
        api.get<DashboardStats>(`/api/v1/dashboard/${companyId}/stats`),
        api.get<DashboardVisitor[]>(`/api/v1/dashboard/${companyId}/visitors`, {
          params: { limit: 20 },
        }),
        api.get<DashboardWidget>(`/api/v1/dashboard/${companyId}/widget`),
      ]);
      initialStats = statsRes.data;
      initialVisitors = visitorsRes.data;
      initialWidget = widgetRes.data;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data on server:", error);
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Column - Stats Grid */}
        <div className="flex-1">
          <CompanyToolbar />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatsCards initialData={initialStats} />
            <ResourcesCard />
          </div>
        </div>

        {/* Right Column - Widget & Visitors */}
        <div className="w-full space-y-6 lg:w-[350px]">
          <WidgetCard initialData={initialWidget} />
          <VisitorsList initialData={initialVisitors} />
        </div>
      </div>
    </div>
  );
}
