import { apiClient } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

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

export interface CreateCompanyPayload {
  name: string;
  website: string;
  industry: string;
  company_size: string;
  country: string;
  timezone: string;
  contact_email: string;
  phone_number: string;
}

export interface UpdateIdentityPayload {
  description: string;
  customer_value: string;
  brand_tone: string;
  primary_language: string;
}

export interface UpdateCompanyTypePayload {
  company_type: string;
}

export interface UpdateBoundariesPayload {
  enabled_sources: string[];
  custom_info: string[];
}

export interface UpdateVoicePayload {
  voice_style: string;
}

// ── API Functions ──────────────────────────────────────────────────────────────

export async function createCompany(
  payload: CreateCompanyPayload,
): Promise<Company> {
  const { data } = await apiClient.post<Company>("/api/v1/companies/", payload);
  return data;
}

export async function updateIdentity(
  companyId: string,
  payload: UpdateIdentityPayload,
): Promise<Company> {
  const { data } = await apiClient.patch<Company>(
    `/api/v1/companies/${companyId}/identity`,
    payload,
  );
  return data;
}

export async function updateCompanyType(
  companyId: string,
  payload: UpdateCompanyTypePayload,
): Promise<Company> {
  const { data } = await apiClient.patch<Company>(
    `/api/v1/companies/${companyId}/type`,
    payload,
  );
  return data;
}

export async function updateBoundaries(
  companyId: string,
  payload: UpdateBoundariesPayload,
): Promise<Company> {
  const { data } = await apiClient.patch<Company>(
    `/api/v1/companies/${companyId}/boundaries`,
    payload,
  );
  return data;
}

export async function updateVoice(
  companyId: string,
  payload: UpdateVoicePayload,
): Promise<Company> {
  const { data } = await apiClient.patch<Company>(
    `/api/v1/companies/${companyId}/voice`,
    payload,
  );
  return data;
}

export async function uploadLogo(
  companyId: string,
  file: File,
): Promise<Company> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.patch<Company>(
    `/api/v1/companies/${companyId}/logo`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}
