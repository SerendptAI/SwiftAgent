import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import type {
  CreateOnlineFormPayload,
  CreateWebsiteFormPayload,
  DeletableFormGroup,
  DeletablePage,
  DeletableWebsite,
  Form,
  FormKeys,
  FormOverview,
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

export function useFormOverview(formId: string | null) {
  const companyId = useActiveCompanyId();

  return useQuery<FormOverview>({
    queryKey: ["forms-overview", companyId, formId],
    queryFn: () => formsApi.getOverview(companyId!, formId!),
    enabled: !!companyId && !!formId,
  });
}

export function useFormOverviews(formIds: string[]) {
  const companyId = useActiveCompanyId();

  return useQueries({
    queries: formIds.map((formId) => ({
      queryKey: ["forms-overview", companyId, formId],
      queryFn: () => formsApi.getOverview(companyId!, formId),
      enabled: !!companyId,
    })),
    combine: (results) => {
      const byId: Record<string, FormOverview> = {};
      results.forEach((result, index) => {
        if (result.data) byId[formIds[index]] = result.data;
      });
      return { byId, isLoading: results.some((result) => result.isLoading) };
    },
  });
}

export function useFormKeys(formId: string | null) {
  const companyId = useActiveCompanyId();

  return useQuery<FormKeys>({
    queryKey: ["forms-keys", companyId, formId],
    queryFn: () => formsApi.getKeys(companyId!, formId!),
    enabled: !!companyId && !!formId,
  });
}

export function useRegenerateFormKeys() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: (formId: string) => formsApi.regenerateKeys(companyId!, formId),
    onSuccess: (_, formId) => {
      queryClient.invalidateQueries({
        queryKey: ["forms-keys", companyId, formId],
      });
    },
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
      queryClient.invalidateQueries({
        queryKey: ["forms-overview", companyId, formId],
      });
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

export function useRenamePageForm() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: ({
      formId,
      pagePath,
      formIdentifier,
      newName,
    }: {
      formId: string;
      pagePath: string;
      formIdentifier: string;
      newName: string;
    }) =>
      formsApi.renamePageForm(
        companyId!,
        formId,
        pagePath,
        formIdentifier,
        newName,
      ),
    onSuccess: (_, { formId }) => {
      queryClient.invalidateQueries({
        queryKey: ["forms-overview", companyId, formId],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["forms-overview", companyId],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["forms-overview", companyId],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["forms-overview", companyId],
      });
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: ({ formId, pagePath }: { formId: string; pagePath: string }) =>
      formsApi.deletePage(companyId!, formId, pagePath),
    onSuccess: (_, { formId }) => {
      queryClient.invalidateQueries({
        queryKey: ["forms-overview", companyId, formId],
      });
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
    },
  });
}

export function useDeletePageForm() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: ({
      formId,
      pagePath,
      formIdentifier,
    }: {
      formId: string;
      pagePath: string;
      formIdentifier: string;
    }) => formsApi.deletePageForm(companyId!, formId, pagePath, formIdentifier),
    onSuccess: (_, { formId }) => {
      queryClient.invalidateQueries({
        queryKey: ["forms-overview", companyId, formId],
      });
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
    },
  });
}

export function useBulkDeleteSubmissions() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: (submissionIds: string[]) =>
      formsApi.bulkDeleteSubmissions(companyId!, submissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
      queryClient.invalidateQueries({
        queryKey: ["forms-overview", companyId],
      });
    },
  });
}

export function useFormSubmissions(
  formId: string | null,
  params: SubmissionListParams = {},
  options: { refetchInterval?: number } = {},
) {
  const companyId = useActiveCompanyId();

  return useQuery<Submission[]>({
    queryKey: ["submissions", companyId, formId, params],
    queryFn: () => formsApi.listFormSubmissions(companyId!, formId!, params),
    enabled: !!companyId && !!formId,
    refetchInterval: options.refetchInterval,
  });
}

export function usePageFormSubmissions(
  formId: string | null,
  pagePath: string | null,
  formIdentifier: string | null,
  params: SubmissionListParams = {},
  options: { refetchInterval?: number } = {},
) {
  const companyId = useActiveCompanyId();

  return useQuery<Submission[]>({
    queryKey: [
      "submissions",
      companyId,
      formId,
      pagePath,
      formIdentifier,
      params,
    ],
    queryFn: () =>
      formsApi.listPageFormSubmissions(
        companyId!,
        formId!,
        pagePath!,
        formIdentifier!,
        params,
      ),
    enabled: !!companyId && !!formId && !!pagePath && !!formIdentifier,
    refetchInterval: options.refetchInterval,
  });
}

/** Count of unread submissions across every form, for the Forms channel badge. */
export function useUnreadSubmissionsCount() {
  const companyId = useActiveCompanyId();

  return useQuery<number>({
    queryKey: ["submissions", companyId, "unread-count"],
    queryFn: async () => {
      const unread = await formsApi.listAllSubmissions(companyId!, {
        is_read: false,
        limit: 100,
      });
      return unread.length;
    },
    enabled: !!companyId,
    // Keep the badge reasonably fresh while the dashboard is open — forms
    // have no websocket like tickets do, so we poll.
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useDeletableWebsites(enabled: boolean) {
  const companyId = useActiveCompanyId();

  return useQuery<DeletableWebsite[]>({
    queryKey: ["forms-delete-websites", companyId],
    queryFn: () => formsApi.listDeletableWebsites(companyId!),
    enabled: enabled && !!companyId,
  });
}

export function useDeletablePages(formId: string | null, enabled: boolean) {
  const companyId = useActiveCompanyId();

  return useQuery<DeletablePage[]>({
    queryKey: ["forms-delete-pages", companyId, formId],
    queryFn: () => formsApi.listDeletablePages(companyId!, formId!),
    enabled: enabled && !!companyId && !!formId,
  });
}

export function useDeletableFormGroups(
  formId: string | null,
  pagePath: string | null,
  enabled: boolean,
) {
  const companyId = useActiveCompanyId();

  return useQuery<DeletableFormGroup[]>({
    queryKey: ["forms-delete-forms", companyId, formId, pagePath],
    queryFn: () =>
      formsApi.listDeletableFormGroups(companyId!, formId!, pagePath!),
    enabled: enabled && !!companyId && !!formId && !!pagePath,
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

export function useReplyToSubmission() {
  const queryClient = useQueryClient();
  const companyId = useActiveCompanyId();

  return useMutation({
    mutationFn: ({
      submissionId,
      replyText,
      subject,
    }: {
      submissionId: string;
      replyText: string;
      subject?: string;
    }) =>
      formsApi.replyToSubmission(companyId!, submissionId, {
        reply_text: replyText,
        ...(subject && { subject }),
      }),
    onSuccess: (updatedSubmission) => {
      queryClient.invalidateQueries({ queryKey: ["submissions", companyId] });
      queryClient.setQueryData(
        ["submissions", companyId, "detail", updatedSubmission.id],
        updatedSubmission,
      );
    },
  });
}
