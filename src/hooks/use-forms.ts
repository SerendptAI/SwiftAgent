import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import type {
  CreateOnlineFormPayload,
  CreateWebsiteFormPayload,
  Form,
  Submission,
  SubmissionListParams,
  UpdateFormPayload,
} from "@/services/forms";
import { formsApi } from "@/services/forms";

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

export function useRenameWebsite() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: ({
      oldWebsite,
      newWebsite,
    }: {
      oldWebsite: string;
      newWebsite: string;
    }) => formsApi.renameWebsite(companyId!, oldWebsite, newWebsite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", companyId] });
    },
  });
}

export function useRenamePage() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: ({
      website,
      oldPage,
      newPage,
    }: {
      website: string;
      oldPage: string;
      newPage: string;
    }) => formsApi.renamePage(companyId!, website, oldPage, newPage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", companyId] });
    },
  });
}

export function useDeleteWebsite() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: (website: string) =>
      formsApi.deleteWebsite(companyId!, website),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", companyId] });
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: ({ website, page }: { website: string; page: string }) =>
      formsApi.deletePage(companyId!, website, page),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", companyId] });
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
    },
  });
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: (submissionId: string) =>
      formsApi.deleteSubmission(companyId!, submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
    },
  });
}

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

export function useMarkSubmissionRead() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: (submissionId: string) =>
      formsApi.markSubmissionRead(companyId!, submissionId),
    onSuccess: (updatedSubmission) => {
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
      queryClient.setQueryData(
        ["submissions", companyId, "detail", updatedSubmission.id],
        updatedSubmission,
      );
    },
  });
}
