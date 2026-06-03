import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiKey, ApiKeyCreated } from "@/services/api-keys";
import { apiKeysApi } from "@/services/api-keys";

const apiKeysKey = (companyId: string | null | undefined) =>
  ["api-keys", companyId] as const;

export function useApiKeys(companyId: string | null | undefined) {
  return useQuery<ApiKey[]>({
    queryKey: apiKeysKey(companyId),
    queryFn: () => apiKeysApi.list(companyId!),
    enabled: !!companyId,
  });
}

export function useCreateApiKey(companyId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation<ApiKeyCreated, unknown, string>({
    mutationFn: (label: string) => apiKeysApi.create(companyId!, { label }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKey(companyId) });
    },
  });
}

export function useRevokeApiKey(companyId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: (keyId: string) => apiKeysApi.revoke(companyId!, keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKey(companyId) });
    },
  });
}
