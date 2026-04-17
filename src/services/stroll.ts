import { apiClient } from "@/lib/api-client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StrollCredentials {
  login_url?: string;
  username: string;
  password: string;
  pre_auth_url?: string;
  username_selector?: string;
  password_selector?: string;
  submit_selector?: string;
}

export interface StrollConfigPayload {
  dashboard_url: string;
  schedule?: string;
  credentials: StrollCredentials;
  sandbox_mode?: boolean;
  max_pages?: number;
}

// ── API ───────────────────────────────────────────────────────────────────────

export const strollApi = {
  /**
   * Create or update the stroll configuration for a company.
   */
  updateConfig: async (
    companyId: string,
    payload: StrollConfigPayload,
  ): Promise<string> => {
    const { data } = await apiClient.put<string>(
      `/api/v1/stroll/${companyId}/config`,
      payload,
    );
    return data;
  },

  /**
   * Trigger a manual stroll — runs in the background.
   */
  run: async (companyId: string): Promise<string> => {
    const { data } = await apiClient.post<string>(
      `/api/v1/stroll/${companyId}/run`,
    );
    return data;
  },

  /**
   * List stroll versions for a company (most recent first).
   */
  listVersions: async (
    companyId: string,
    limit: number = 10,
  ): Promise<string> => {
    const { data } = await apiClient.get<string>(
      `/api/v1/stroll/${companyId}/versions`,
      { params: { limit } },
    );
    return data;
  },
};
