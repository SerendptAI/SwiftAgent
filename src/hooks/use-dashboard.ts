import { useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/use-auth";
import { dashboardApi } from "@/services/dashboard";

export function useDashboardStats() {
  const { data: user } = useCurrentUser();
  const companyId = user?.company_id;

  return useQuery({
    queryKey: ["dashboard", "stats", companyId],
    queryFn: () => dashboardApi.getStats(companyId!),
    enabled: !!companyId,
  });
}

export function useDashboardVisitors(limit: number = 20) {
  const { data: user } = useCurrentUser();
  const companyId = user?.company_id;

  return useQuery({
    queryKey: ["dashboard", "visitors", companyId, limit],
    queryFn: () => dashboardApi.getVisitors(companyId!, limit),
    enabled: !!companyId,
  });
}

export function useDashboardWidget() {
  const { data: user } = useCurrentUser();
  const companyId = user?.company_id;

  return useQuery({
    queryKey: ["dashboard", "widget", companyId],
    queryFn: () => dashboardApi.getWidget(companyId!),
    enabled: !!companyId,
  });
}
