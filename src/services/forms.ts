import { apiClient } from "@/lib/api-client";
import { publicApiClient } from "@/lib/public-api-client";
import { unwrapList } from "@/lib/unwrap-list";

export type FormType = "website" | "online";

export interface Form {
  id: string;
  company_id: string;
  type: FormType;
  tags: string[];
  created_at: string;
  updated_at: string;
  website_link?: string;
  alert_email?: string;
  form_image?: string;
  form_title?: string;
}

export interface Submission {
  id: string;
  form_id: string;
  company_id: string;
  data: Record<string, unknown>;
  is_read: boolean;
  visitor_id: string;
  submitted_at: string;
}

export interface CreateWebsiteFormPayload {
  website_link: string;
  alert_email: string;
  tags?: string[];
}

export interface CreateOnlineFormPayload {
  form_image: string;
  form_title: string;
  tags?: string[];
}

export interface UpdateFormPayload {
  website_link?: string;
  alert_email?: string;
  form_image?: string;
  form_title?: string;
  tags?: string[];
}

export interface SubmitFormPayload {
  data: Record<string, unknown>;
  visitor_id?: string;
}

export interface SubmissionListParams {
  is_read?: boolean | null;
  skip?: number;
  limit?: number;
}

export function getFormEmbedCode(formId: string): string {
  return `<script src="https://swiftagents.org/chat-widget.js"></script>\n<div id="swift-form" data-form-id="${formId}"></div>`;
}

export function getFormDisplayName(form: Form): string {
  return form.form_title ?? form.website_link ?? form.id;
}

export const formsApi = {
  createWebsiteForm: async (
    companyId: string,
    payload: CreateWebsiteFormPayload,
  ): Promise<Form> => {
    const { data } = await apiClient.post<Form>(
      `/api/v1/forms/${encodeURIComponent(companyId)}/website-forms`,
      payload,
    );
    return data;
  },

  createOnlineForm: async (
    companyId: string,
    payload: CreateOnlineFormPayload,
  ): Promise<Form> => {
    const { data } = await apiClient.post<Form>(
      `/api/v1/forms/${encodeURIComponent(companyId)}/online-forms`,
      payload,
    );
    return data;
  },

  list: async (
    companyId: string,
    skip: number = 0,
    limit: number = 50,
  ): Promise<Form[]> => {
    const { data } = await apiClient.get<Form[] | { items: Form[] }>(
      `/api/v1/forms/${encodeURIComponent(companyId)}`,
      { params: { skip, limit } },
    );
    return unwrapList(data);
  },

  getById: async (companyId: string, formId: string): Promise<Form> => {
    const { data } = await apiClient.get<Form>(
      `/api/v1/forms/${encodeURIComponent(companyId)}/${encodeURIComponent(formId)}`,
    );
    return data;
  },

  update: async (
    companyId: string,
    formId: string,
    payload: UpdateFormPayload,
  ): Promise<Form> => {
    const { data } = await apiClient.put<Form>(
      `/api/v1/forms/${encodeURIComponent(companyId)}/${encodeURIComponent(formId)}`,
      payload,
    );
    return data;
  },

  delete: async (companyId: string, formId: string): Promise<void> => {
    await apiClient.delete(
      `/api/v1/forms/${encodeURIComponent(companyId)}/${encodeURIComponent(formId)}`,
    );
  },

  listAllSubmissions: async (
    companyId: string,
    params: SubmissionListParams = {},
  ): Promise<Submission[]> => {
    const { is_read, skip = 0, limit = 50 } = params;
    const { data } = await apiClient.get<
      Submission[] | { items: Submission[] }
    >(`/api/v1/forms/${encodeURIComponent(companyId)}/submissions/all`, {
      params: { ...(is_read != null && { is_read }), skip, limit },
    });
    return unwrapList(data);
  },

  listFormSubmissions: async (
    companyId: string,
    formId: string,
    params: SubmissionListParams = {},
  ): Promise<Submission[]> => {
    const { is_read, skip = 0, limit = 50 } = params;
    const { data } = await apiClient.get<
      Submission[] | { items: Submission[] }
    >(
      `/api/v1/forms/${encodeURIComponent(companyId)}/${encodeURIComponent(formId)}/submissions`,
      { params: { ...(is_read != null && { is_read }), skip, limit } },
    );
    return unwrapList(data);
  },

  getSubmission: async (
    companyId: string,
    submissionId: string,
  ): Promise<Submission> => {
    const { data } = await apiClient.get<Submission>(
      `/api/v1/forms/${encodeURIComponent(companyId)}/submissions/${encodeURIComponent(submissionId)}`,
    );
    return data;
  },

  markSubmissionRead: async (
    companyId: string,
    submissionId: string,
  ): Promise<Submission> => {
    const { data } = await apiClient.put<Submission>(
      `/api/v1/forms/${encodeURIComponent(companyId)}/submissions/${encodeURIComponent(submissionId)}/read`,
    );
    return data;
  },
};

export const publicFormsApi = {
  /** Used by the embedded widget or external site to render form fields. No auth required. */
  getPublishedForm: async (formId: string): Promise<Form> => {
    const { data } = await publicApiClient.get<Form>(
      `/api/v1/public/forms/${encodeURIComponent(formId)}`,
    );
    return data;
  },

  /** Triggers an alert email to the company if the form has alert_email set. No auth required. */
  submit: async (
    formId: string,
    payload: SubmitFormPayload,
  ): Promise<Submission> => {
    const { data } = await publicApiClient.post<Submission>(
      `/api/v1/public/forms/${encodeURIComponent(formId)}/submit`,
      payload,
    );
    return data;
  },
};
