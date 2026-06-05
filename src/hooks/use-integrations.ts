import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  Integration,
  IntegrationCreatePayload,
  IntegrationTestResult,
  IntegrationUpdatePayload,
} from "@/services/integrations";
import { integrationsApi } from "@/services/integrations";

const integrationsKey = (companyId: string | null | undefined) =>
  ["integrations", companyId] as const;

export function useIntegrations(companyId: string | null | undefined) {
  return useQuery<Integration[]>({
    queryKey: integrationsKey(companyId),
    queryFn: () => integrationsApi.list(companyId!),
    enabled: !!companyId,
  });
}

export function useIntegration(
  companyId: string | null | undefined,
  integrationId: string | null | undefined,
) {
  return useQuery<Integration>({
    queryKey: ["integration", companyId, integrationId],
    queryFn: () => integrationsApi.get(companyId!, integrationId!),
    enabled: !!companyId && !!integrationId,
  });
}

export function useCreateIntegration(companyId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IntegrationCreatePayload) =>
      integrationsApi.create(companyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsKey(companyId) });
    },
  });
}

export function useUpdateIntegration(companyId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      integrationId,
      payload,
    }: {
      integrationId: string;
      payload: IntegrationUpdatePayload;
    }) => integrationsApi.update(companyId!, integrationId, payload),
    onSuccess: (_, { integrationId }) => {
      queryClient.invalidateQueries({ queryKey: integrationsKey(companyId) });
      queryClient.invalidateQueries({
        queryKey: ["integration", companyId, integrationId],
      });
    },
  });
}

export function useDeactivateIntegration(companyId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (integrationId: string) =>
      integrationsApi.deactivate(companyId!, integrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsKey(companyId) });
    },
  });
}

export function useTestIntegration(companyId: string | null | undefined) {
  return useMutation<
    IntegrationTestResult,
    unknown,
    { integrationId: string; endpointName: string }
  >({
    mutationFn: ({ integrationId, endpointName }) =>
      integrationsApi.test(companyId!, integrationId, endpointName),
  });
}
