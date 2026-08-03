import { useQuery } from "@tanstack/react-query";

import {
  AnalyticsSection,
  AnalyticsViews,
  DateRange,
  DAYS_BY_RANGE,
} from "@/lib/admin-analytics";
import { toAnalyticsView } from "@/lib/admin-analytics-adapters";
import { adminAnalyticsApi } from "@/services/admin-analytics";

export function useAnalyticsSection<S extends AnalyticsSection>(
  section: S,
  range: DateRange,
) {
  const days = DAYS_BY_RANGE[range];

  return useQuery<AnalyticsViews[S]>({
    queryKey: ["admin-analytics", section, days],
    queryFn: async () =>
      toAnalyticsView(
        section,
        await adminAnalyticsApi.getSection(section, days),
      ),
  });
}
