import axios from "axios";

import { apiClient } from "@/lib/api-client";

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
};
