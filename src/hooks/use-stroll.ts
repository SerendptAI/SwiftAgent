import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { StrollConfigPayload } from "@/services/stroll";
import { strollApi } from "@/services/stroll";

export function useStrollConfig(companyId: string | null | undefined) {
  return useQuery({
    queryKey: ["stroll-config", companyId],
    queryFn: () => {
      if (!companyId) throw new Error("No company ID provided");
      return strollApi.getConfig(companyId);
    },
    enabled: !!companyId,
  });
}

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
        queryKey: ["stroll-config", companyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["stroll-versions", companyId],
      });
    },
  });
}
