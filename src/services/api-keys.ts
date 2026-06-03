import { apiClient } from "@/lib/api-client";

// ── Types ─────────────────────────────────────────────────────────────────────

/** An API key as returned by the list endpoint (never includes the raw secret). */
export interface ApiKey {
  id: string;
  label: string;
  /** Non-secret prefix shown so users can recognise the key, e.g. `swa_live_abc…`. */
  key_prefix: string;
  active: boolean;
  created_at: string;
  last_used_at?: string | null;
}

/**
 * Response from creating a key. The raw `key` (e.g. `swa_live_…`) is only ever
 * present here — the backend hashes it (SHA-256) and never returns it again.
 */
export interface ApiKeyCreated {
  id: string;
  key: string;
  key_prefix: string;
  label: string;
  created_at: string;
}

export type ApiKeyCreatePayload = {
  label: string;
};

// ── API ───────────────────────────────────────────────────────────────────────

const base = (companyId: string) => `/api/v1/companies/${companyId}/api-keys`;

export const apiKeysApi = {
  list: async (companyId: string): Promise<ApiKey[]> => {
    const { data } = await apiClient.get<ApiKey[]>(`${base(companyId)}`);
    return data;
  },

  create: async (
    companyId: string,
    payload: ApiKeyCreatePayload,
  ): Promise<ApiKeyCreated> => {
    const { data } = await apiClient.post<ApiKeyCreated>(
      `${base(companyId)}`,
      payload,
    );
    return data;
  },

  revoke: async (companyId: string, keyId: string): Promise<void> => {
    await apiClient.delete(`${base(companyId)}/${keyId}`);
  },
};
