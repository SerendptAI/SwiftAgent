import { useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/use-auth";
import {
  dashboardApi,
  DashboardStats,
  DashboardVisitor,
  DashboardWidget,
} from "@/services/dashboard";

export function useDashboardStats(initialData?: DashboardStats | null) {
  const { data: user } = useCurrentUser();
  const companyId = user?.company_id;

  return useQuery({
    queryKey: ["dashboard", "stats", companyId],
    queryFn: () => dashboardApi.getStats(companyId!),
    enabled: !!companyId,
    initialData: initialData ?? undefined,
  });
}

export function useDashboardVisitors(
  limit: number = 20,
  initialData?: DashboardVisitor[],
) {
  const { data: user } = useCurrentUser();
  const companyId = user?.company_id;

  return useQuery({
    queryKey: ["dashboard", "visitors", companyId, limit],
    queryFn: () => dashboardApi.getVisitors(companyId!, limit),
    enabled: !!companyId,
    initialData: initialData ?? undefined,
  });
}

export function useDashboardWidget(initialData?: DashboardWidget | null) {
  const { data: user } = useCurrentUser();
  const companyId = user?.company_id;

  return useQuery({
    queryKey: ["dashboard", "widget", companyId],
    queryFn: () => dashboardApi.getWidget(companyId!),
    enabled: !!companyId,
    initialData: initialData ?? undefined,
  });
}
