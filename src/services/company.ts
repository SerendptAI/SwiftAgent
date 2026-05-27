import axios from "axios";

import { apiClient } from "@/lib/api-client";
import { publicApiClient } from "@/lib/public-api-client";

export interface Company {
  id: string;
  user_id: string;
  name: string;
  logo_url: string;
  company_type: string;
  onboarding_step: number;
  setup_complete: boolean;
  website: string;
  industry: string;
  company_size: string;
  country: string;
  timezone: string;
  contact_email: string;
  phone_number: string;
  description: string;
  customer_value: string;
  brand_tone: string;
  primary_language: string;
  support_emails: string[];
  suggested_ai_prompts: string[];
  enabled_sources: string[];
  custom_info: string[];
  voice_style: string;
  email_slug?: string;
  email_address?: string;
  backup_email?: string;
  access_code?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailSlugCheckResult {
  available: boolean;
  suggestion?: string;
}

export type CompanyUpdateSection =
  | "info"
  | "identity"
  | "type"
  | "boundaries"
  | "voice"
  | "security";

export type CompanyListItem = {
  id: string;
  name: string;
  logo_url: string;
  setup_complete: boolean;
  onboarding_step: number;
};

export const companyApi = {
  list: async (): Promise<CompanyListItem[]> => {
    const { data } =
      await apiClient.get<CompanyListItem[]>("/api/v1/companies/");
    return data;
  },

  create: async (payload: Record<string, unknown>): Promise<Company> => {
    const { data } = await apiClient.post<Company>(
      "/api/v1/companies/",
      payload,
    );
    return data;
  },

  get: async (companyId: string): Promise<Company> => {
    const { data } = await apiClient.get<Company>(
      `/api/v1/companies/${companyId}`,
    );
    return data;
  },

  update: async (
    companyId: string,
    section: CompanyUpdateSection,
    payload: Record<string, unknown>,
  ): Promise<Company> => {
    const { data } = await apiClient.patch<Company>(
      `/api/v1/companies/${companyId}/${section}`,
      payload,
    );
    return data;
  },

  uploadLogo: async (companyId: string, file: File): Promise<Company> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.patch<Company>(
      `/api/v1/companies/${companyId}/logo`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  checkEmailSlug: async (
    companyId: string,
    slug: string,
  ): Promise<EmailSlugCheckResult> => {
    const { data } = await apiClient.get<EmailSlugCheckResult>(
      `/api/v1/companies/${companyId}/email-slug/check`,
      { params: { slug } },
    );
    return data;
  },

  updateEmailSlug: async (
    companyId: string,
    slug: string,
  ): Promise<Company> => {
    const { data } = await apiClient.patch<Company>(
      `/api/v1/companies/${companyId}/email-slug`,
      { email_slug: slug },
    );
    return data;
  },

  inviteMember: async (
    companyId: string,
    email: string,
  ): Promise<Record<string, unknown>> => {
    const { data } = await apiClient.post<Record<string, unknown>>(
      `/api/v1/companies/${companyId}/invites`,
      { email },
    );
    return data;
  },
};

export const publicCompanyApi = {
  get: async (companyId: string): Promise<Company> => {
    const url = `/api/v1/companies/${companyId}/public`;
    try {
      const { data } = await publicApiClient.get<Company>(url);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(`[publicCompanyApi] FAILED to fetch company:`, {
          url,
          status: err.response?.status,
          message: err.message,
          data: err.response?.data,
        });
      } else {
        console.error(
          `[publicCompanyApi] FAILED to fetch company (non-axios):`,
          err,
        );
      }
      throw err;
    }
  },
};
