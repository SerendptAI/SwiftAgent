import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import type {
  CreateOnlineFormPayload,
  CreateWebsiteFormPayload,
  Form,
  Submission,
  SubmissionListParams,
  SubmitFormPayload,
  UpdateFormPayload,
} from "@/services/forms";
import { formsApi, publicFormsApi } from "@/services/forms";

// ── Forms ──────────────────────────────────────────────────────────────────────

export function useForms() {
  const companyId = useActiveCompanyId();

  return useQuery<Form[]>({
    queryKey: ["forms", companyId],
    queryFn: () => formsApi.list(companyId!),
    enabled: !!companyId,
  });
}

export function useForm(formId: string | null) {
  const companyId = useActiveCompanyId();

  return useQuery<Form>({
    queryKey: ["forms", companyId, formId],
    queryFn: () => formsApi.getById(companyId!, formId!),
    enabled: !!companyId && !!formId,
  });
}

export function useCreateWebsiteForm() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: (payload: CreateWebsiteFormPayload) =>
      formsApi.createWebsiteForm(companyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", companyId] });
    },
  });
}

export function useCreateOnlineForm() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: (payload: CreateOnlineFormPayload) =>
      formsApi.createOnlineForm(companyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", companyId] });
    },
  });
}

export function useUpdateForm() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: ({
      formId,
      payload,
    }: {
      formId: string;
      payload: UpdateFormPayload;
    }) => formsApi.update(companyId!, formId, payload),
    onSuccess: (_, { formId }) => {
      queryClient.invalidateQueries({ queryKey: ["forms", companyId] });
      queryClient.invalidateQueries({ queryKey: ["forms", companyId, formId] });
    },
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: (formId: string) => formsApi.delete(companyId!, formId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", companyId] });
    },
  });
}

// ── Submissions ────────────────────────────────────────────────────────────────

export function useAllSubmissions(params: SubmissionListParams = {}) {
  const companyId = useActiveCompanyId();

  return useQuery<Submission[]>({
    queryKey: ["submissions", companyId, params],
    queryFn: () => formsApi.listAllSubmissions(companyId!, params),
    enabled: !!companyId,
  });
}

export function useFormSubmissions(
  formId: string | null,
  params: SubmissionListParams = {},
) {
  const companyId = useActiveCompanyId();

  return useQuery<Submission[]>({
    queryKey: ["submissions", companyId, formId, params],
    queryFn: () => formsApi.listFormSubmissions(companyId!, formId!, params),
    enabled: !!companyId && !!formId,
  });
}

export function useSubmission(submissionId: string | null) {
  const companyId = useActiveCompanyId();

  return useQuery<Submission>({
    queryKey: ["submissions", companyId, "detail", submissionId],
    queryFn: () => formsApi.getSubmission(companyId!, submissionId!),
    enabled: !!companyId && !!submissionId,
  });
}

export function useMarkSubmissionRead() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: (submissionId: string) =>
      formsApi.markSubmissionRead(companyId!, submissionId),
    onSuccess: (updatedSubmission) => {
      // Invalidate list queries and seed the detail cache with the fresh data.
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
      queryClient.setQueryData(
        ["submissions", companyId, "detail", updatedSubmission.id],
        updatedSubmission,
      );
    },
  });
}

// ── Public ─────────────────────────────────────────────────────────────────────

export function usePublishedForm(formId: string | null) {
  return useQuery<Form>({
    queryKey: ["publicForm", formId],
    queryFn: () => publicFormsApi.getPublishedForm(formId!),
    enabled: !!formId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitForm() {
  return useMutation({
    mutationFn: ({
      formId,
      payload,
    }: {
      formId: string;
      payload: SubmitFormPayload;
    }) => publicFormsApi.submit(formId, payload),
  });
}
