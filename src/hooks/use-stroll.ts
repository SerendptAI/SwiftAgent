import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { StrollConfigPayload } from "@/services/stroll";
import { strollApi } from "@/services/stroll";

export function useUpdateStrollConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      payload,
    }: {
      companyId: string;
      payload: StrollConfigPayload;
    }) => strollApi.updateConfig(companyId, payload),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["stroll-versions", companyId],
      });
    },
  });
}

export function useRunStroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId }: { companyId: string }) =>
      strollApi.run(companyId),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["stroll-versions", companyId],
      });
    },
  });
}

export function useStrollVersions(
  companyId: string | null | undefined,
  limit: number = 10,
) {
  return useQuery({
    queryKey: ["stroll-versions", companyId, limit],
    queryFn: () => {
      if (!companyId) throw new Error("No company ID provided");
      return strollApi.listVersions(companyId, limit);
    },
    enabled: !!companyId,
  });
}
