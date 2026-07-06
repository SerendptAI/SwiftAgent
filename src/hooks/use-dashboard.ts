import { useQuery } from "@tanstack/react-query";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import {
  dashboardApi,
  DashboardStats,
  DashboardVisitor,
} from "@/services/dashboard";

export function useDashboardStats(initialData?: DashboardStats | null) {
  const companyId = useActiveCompanyId();

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
  const companyId = useActiveCompanyId();

  return useQuery({
    queryKey: ["dashboard", "visitors", companyId, limit],
    queryFn: () => dashboardApi.getVisitors(companyId!, limit),
    enabled: !!companyId,
    initialData: initialData ?? undefined,
    refetchInterval: 3000,
  });
}
