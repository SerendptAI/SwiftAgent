import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { ResourcesCard } from "@/components/dashboard/overview/resources-card";
import { StatsCards } from "@/components/dashboard/overview/stats-cards";
import { VisitorsList } from "@/components/dashboard/overview/visitors-list";
import { WidgetCard } from "@/components/dashboard/overview/widget-card";
import { OfflineScreen } from "@/components/offline-screen";
import { getServerApiClient } from "@/lib/api-server";
import { DashboardStats, DashboardVisitor } from "@/services/dashboard";

export default async function DashboardPage() {
  const api = await getServerApiClient();

  let initialStats: DashboardStats | null = null;
  let initialVisitors: DashboardVisitor[] = [];

  try {
    const { data: user } = await api.get("/api/v1/auth/me");
    const companyId = user.company_id;

    if (companyId) {
      const [statsRes, visitorsRes] = await Promise.all([
        api.get<DashboardStats>(`/api/v1/dashboard/${companyId}/stats`),
        api.get<DashboardVisitor[]>(`/api/v1/dashboard/${companyId}/visitors`, {
          params: { limit: 20 },
        }),
      ]);
      initialStats = statsRes.data;
      initialVisitors = visitorsRes.data;
    }
  } catch {
    // Server-side pre-fetch is best-effort; client-side hooks will hydrate.
  }

  return (
    <div className="min-h-full w-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <CompanyToolbar />
          <OfflineScreen>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
              <StatsCards initialData={initialStats} />
              <ResourcesCard />
            </div>
          </OfflineScreen>
        </div>

        <div className="w-full min-w-0 space-y-4 lg:w-[350px] lg:space-y-6">
          <WidgetCard />
          <VisitorsList initialData={initialVisitors} />
        </div>
      </div>
    </div>
  );
}
