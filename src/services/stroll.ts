import axios from "axios";

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

export interface StrollVersionSummary {
  version_id: string;
  created_at: string;
  status: string;
  [key: string]: unknown;
}

export interface StrollVersion extends StrollVersionSummary {
  graph?: unknown;
  [key: string]: unknown;
}

export interface StrollStatus {
  status: string;
  [key: string]: unknown;
}

// ── API ───────────────────────────────────────────────────────────────────────

export const strollApi = {
  /**
   * Get the stroll configuration for a company. Returns null when no config
   * has been saved yet (404).
   */
  getConfig: async (companyId: string): Promise<StrollConfigPayload | null> => {
    try {
      const { data } = await apiClient.get<StrollConfigPayload>(
        `/api/v1/stroll/${companyId}/config`,
      );
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

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
  ): Promise<StrollVersionSummary[]> => {
    const { data } = await apiClient.get<StrollVersionSummary[]>(
      `/api/v1/stroll/${companyId}/versions`,
      { params: { limit } },
    );
    return data;
  },

  /**
   * Get the latest successful stroll version with full graph data.
   */
  getLatestVersion: async (companyId: string): Promise<StrollVersion> => {
    const { data } = await apiClient.get<StrollVersion>(
      `/api/v1/stroll/${companyId}/versions/latest`,
    );
    return data;
  },

  /**
   * Get a specific stroll version with full graph data.
   */
  getVersion: async (
    companyId: string,
    versionId: string,
  ): Promise<StrollVersion> => {
    const { data } = await apiClient.get<StrollVersion>(
      `/api/v1/stroll/${companyId}/versions/${versionId}`,
    );
    return data;
  },

  /**
   * Get the latest stroll status for a company.
   */
  getStatus: async (companyId: string): Promise<StrollStatus> => {
    const { data } = await apiClient.get<StrollStatus>(
      `/api/v1/stroll/${companyId}/status`,
    );
    return data;
  },
};
