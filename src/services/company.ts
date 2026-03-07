import { apiClient } from "@/lib/api-client";

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
  enabled_sources: string[];
  custom_info: string[];
  voice_style: string;
  created_at: string;
  updated_at: string;
}

export type CompanyUpdateSection =
  | "info"
  | "identity"
  | "type"
  | "boundaries"
  | "voice";

export const companyApi = {
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
};
