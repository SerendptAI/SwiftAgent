import { apiClient } from "@/lib/api-client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface APIEndpoint {
  name: string;
  path: string;
  description: string;
  query_params?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface Integration {
  id: string;
  company_id: string;
  name: string;
  base_url: string;
  auth_header: string;
  auth_prefix: string;
  documentation: string;
  documentation_url: string;
  endpoints: APIEndpoint[];
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export type IntegrationCreatePayload = {
  name: string;
  base_url: string;
  api_key?: string;
  auth_header?: string;
  auth_prefix?: string;
  documentation?: string;
  documentation_url?: string;
  endpoints?: APIEndpoint[];
};

export type IntegrationUpdatePayload = Partial<IntegrationCreatePayload>;

export type IntegrationTestResult = unknown;

// ── API ───────────────────────────────────────────────────────────────────────

const base = (companyId: string) =>
  `/api/v1/companies/${companyId}/integrations`;

export const integrationsApi = {
  list: async (companyId: string): Promise<Integration[]> => {
    const { data } = await apiClient.get<Integration[]>(`${base(companyId)}/`);
    return data;
  },

  get: async (
    companyId: string,
    integrationId: string,
  ): Promise<Integration> => {
    const { data } = await apiClient.get<Integration>(
      `${base(companyId)}/${integrationId}`,
    );
    return data;
  },

  create: async (
    companyId: string,
    payload: IntegrationCreatePayload,
  ): Promise<Integration> => {
    const { data } = await apiClient.post<Integration>(
      `${base(companyId)}/`,
      payload,
    );
    return data;
  },

  update: async (
    companyId: string,
    integrationId: string,
    payload: IntegrationUpdatePayload,
  ): Promise<Integration> => {
    const { data } = await apiClient.patch<Integration>(
      `${base(companyId)}/${integrationId}`,
      payload,
    );
    return data;
  },

  deactivate: async (
    companyId: string,
    integrationId: string,
  ): Promise<void> => {
    await apiClient.delete(`${base(companyId)}/${integrationId}`);
  },

  test: async (
    companyId: string,
    integrationId: string,
    endpointName: string,
  ): Promise<IntegrationTestResult> => {
    const { data } = await apiClient.post<IntegrationTestResult>(
      `${base(companyId)}/${integrationId}/test`,
      undefined,
      { params: { endpoint_name: endpointName } },
    );
    return data;
  },
};
