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

export function useRunStroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId }: { companyId: string }) =>
      strollApi.run(companyId),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["stroll-versions", companyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["stroll-status", companyId],
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

export function useLatestStrollVersion(companyId: string | null | undefined) {
  return useQuery({
    queryKey: ["stroll-version-latest", companyId],
    queryFn: () => {
      if (!companyId) throw new Error("No company ID provided");
      return strollApi.getLatestVersion(companyId);
    },
    enabled: !!companyId,
  });
}

export function useStrollVersion(
  companyId: string | null | undefined,
  versionId: string | null | undefined,
) {
  return useQuery({
    queryKey: ["stroll-version", companyId, versionId],
    queryFn: () => {
      if (!companyId || !versionId) throw new Error("Missing id");
      return strollApi.getVersion(companyId, versionId);
    },
    enabled: !!companyId && !!versionId,
  });
}

export function useStrollStatus(companyId: string | null | undefined) {
  return useQuery({
    queryKey: ["stroll-status", companyId],
    queryFn: () => {
      if (!companyId) throw new Error("No company ID provided");
      return strollApi.getStatus(companyId);
    },
    enabled: !!companyId,
  });
}
