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
  form_url?: string;
  /** Full secrets — only present on the create/regenerate responses. */
  api_key?: string;
  public_key?: string;
  snippet?: string;
}

export interface Submission {
  id: string;
  form_id: string;
  company_id: string;
  data: Record<string, unknown>;
  is_read: boolean;
  visitor_id?: string;
  submitted_at: string;
  submitter_name?: string;
  submitter_preview?: string;
}

export interface OverviewFormGroup {
  form_identifier: string;
  form_name: string;
  entries_count: number;
  last_submission?: string | null;
}

export interface OverviewPage {
  page_path: string;
  total_entries: number;
  forms: OverviewFormGroup[];
}

export interface FormOverview {
  form_id: string;
  website_link?: string;
  total_entries: number;
  pages: OverviewPage[];
}

export interface FormKeys {
  form_id: string;
  api_key_prefix: string;
  public_key_prefix: string;
  snippet: string;
}

export interface RegeneratedFormKeys {
  api_key: string;
  public_key: string;
  snippet: string;
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

export function getFormDisplayName(form: Form): string {
  return form.form_title ?? form.website_link ?? form.id;
}

export function getSubmissionDisplayName(submission: Submission): string {
  if (submission.submitter_name?.trim())
    return submission.submitter_name.trim();
  for (const key of [
    "name",
    "Name",
    "full_name",
    "fullName",
    "firstName",
    "first_name",
    "username",
  ]) {
    const val = submission.data[key];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return submission.visitor_id
    ? `Visitor ${submission.visitor_id.slice(0, 6)}`
    : "Anonymous";
}

const BASE = "/api/v1/forms";
const enc = encodeURIComponent;

export const formsApi = {
  createWebsiteForm: async (
    companyId: string,
    payload: CreateWebsiteFormPayload,
  ): Promise<Form> => {
    const { data } = await apiClient.post<Form>(
      `${BASE}/${enc(companyId)}/website-forms`,
      payload,
    );
    return data;
  },

  createOnlineForm: async (
    companyId: string,
    payload: CreateOnlineFormPayload,
  ): Promise<Form> => {
    const { data } = await apiClient.post<Form>(
      `${BASE}/${enc(companyId)}/online-forms`,
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
      `${BASE}/${enc(companyId)}`,
      { params: { skip, limit } },
    );
    return unwrapList(data);
  },

  getById: async (companyId: string, formId: string): Promise<Form> => {
    const { data } = await apiClient.get<Form>(
      `${BASE}/${enc(companyId)}/${enc(formId)}`,
    );
    return data;
  },

  update: async (
    companyId: string,
    formId: string,
    payload: UpdateFormPayload,
  ): Promise<Form> => {
    const { data } = await apiClient.put<Form>(
      `${BASE}/${enc(companyId)}/${enc(formId)}`,
      payload,
    );
    return data;
  },

  delete: async (companyId: string, formId: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${enc(companyId)}/${enc(formId)}`);
  },

  getOverview: async (
    companyId: string,
    formId: string,
  ): Promise<FormOverview> => {
    const { data } = await apiClient.get<FormOverview>(
      `${BASE}/${enc(companyId)}/${enc(formId)}/overview`,
    );
    return data;
  },

  getKeys: async (companyId: string, formId: string): Promise<FormKeys> => {
    const { data } = await apiClient.get<FormKeys>(
      `${BASE}/${enc(companyId)}/${enc(formId)}/keys`,
    );
    return data;
  },

  regenerateKeys: async (
    companyId: string,
    formId: string,
  ): Promise<RegeneratedFormKeys> => {
    const { data } = await apiClient.post<RegeneratedFormKeys>(
      `${BASE}/${enc(companyId)}/${enc(formId)}/keys/regenerate`,
      {},
    );
    return data;
  },

  renamePageForm: async (
    companyId: string,
    formId: string,
    pagePath: string,
    formIdentifier: string,
    newName: string,
  ): Promise<void> => {
    await apiClient.put(
      `${BASE}/${enc(companyId)}/${enc(formId)}/pages/${enc(pagePath)}/forms/${enc(formIdentifier)}/rename`,
      { new_name: newName },
    );
  },

  renameWebsite: async (
    companyId: string,
    oldWebsite: string,
    newWebsite: string,
  ): Promise<void> => {
    await apiClient.put(`${BASE}/${enc(companyId)}/websites/label`, {
      old_website: oldWebsite,
      new_website: newWebsite,
    });
  },

  renamePage: async (
    companyId: string,
    website: string,
    oldPage: string,
    newPage: string,
  ): Promise<void> => {
    await apiClient.put(`${BASE}/${enc(companyId)}/pages/label`, {
      website,
      old_page: oldPage,
      new_page: newPage,
    });
  },

  deleteWebsite: async (companyId: string, website: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${enc(companyId)}/websites`, {
      params: { website },
    });
  },

  deletePage: async (
    companyId: string,
    formId: string,
    pagePath: string,
  ): Promise<void> => {
    await apiClient.delete(
      `${BASE}/${enc(companyId)}/${enc(formId)}/pages/${enc(pagePath)}`,
    );
  },

  deletePageForm: async (
    companyId: string,
    formId: string,
    pagePath: string,
    formIdentifier: string,
  ): Promise<void> => {
    await apiClient.delete(
      `${BASE}/${enc(companyId)}/${enc(formId)}/pages/${enc(pagePath)}/forms/${enc(formIdentifier)}`,
    );
  },

  bulkDeleteSubmissions: async (
    companyId: string,
    submissionIds: string[],
  ): Promise<void> => {
    await apiClient.delete(`${BASE}/${enc(companyId)}/submissions/bulk`, {
      data: { submission_ids: submissionIds },
    });
  },

  listFormSubmissions: async (
    companyId: string,
    formId: string,
    params: SubmissionListParams = {},
  ): Promise<Submission[]> => {
    const { is_read, skip = 0, limit = 50 } = params;
    const { data } = await apiClient.get<
      Submission[] | { items: Submission[] }
    >(`${BASE}/${enc(companyId)}/${enc(formId)}/submissions`, {
      params: { ...(is_read != null && { is_read }), skip, limit },
    });
    return unwrapList(data);
  },

  listPageFormSubmissions: async (
    companyId: string,
    formId: string,
    pagePath: string,
    formIdentifier: string,
    params: SubmissionListParams = {},
  ): Promise<Submission[]> => {
    const { skip = 0, limit = 50 } = params;
    const { data } = await apiClient.get<
      Submission[] | { items: Submission[] }
    >(
      `${BASE}/${enc(companyId)}/${enc(formId)}/pages/${enc(pagePath)}/forms/${enc(formIdentifier)}/submissions`,
      { params: { skip, limit } },
    );
    return unwrapList(data);
  },

  getSubmission: async (
    companyId: string,
    submissionId: string,
  ): Promise<Submission> => {
    const { data } = await apiClient.get<Submission>(
      `${BASE}/${enc(companyId)}/submissions/${enc(submissionId)}`,
    );
    return data;
  },

  markSubmissionRead: async (
    companyId: string,
    submissionId: string,
  ): Promise<Submission> => {
    const { data } = await apiClient.put<Submission>(
      `${BASE}/${enc(companyId)}/submissions/${enc(submissionId)}/read`,
    );
    return data;
  },
};

export const publicFormsApi = {
  /** Used by the embedded widget or external site to render form fields. No auth required. */
  getPublishedForm: async (formId: string): Promise<Form> => {
    const { data } = await publicApiClient.get<Form>(
      `/api/v1/public/forms/${enc(formId)}`,
    );
    return data;
  },

  /** Triggers an alert email to the company if the form has alert_email set. No auth required. */
  submit: async (
    formId: string,
    payload: SubmitFormPayload,
  ): Promise<Submission> => {
    const { data } = await publicApiClient.post<Submission>(
      `/api/v1/public/forms/${enc(formId)}/submit`,
      payload,
    );
    return data;
  },
};
