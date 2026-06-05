import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type {
  Company,
  CompanyMember,
  CompanyUpdateSection,
} from "@/services/company";
import { companyApi, publicCompanyApi } from "@/services/company";

/**
 * Module-level cache so re-mounts never re-fetch.
 */
const publicCompanyCache = new Map<string, Company>();
const publicCompanyPending = new Set<string>();

export function useCompaniesQuery() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => companyApi.list(),
  });
}

export function useCompanyMutations() {
  const queryClient = useQueryClient();

  const createCompany = useMutation({
    mutationFn: companyApi.create,
    onSuccess: (company) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", company.id] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const updateCompany = useMutation({
    mutationFn: ({
      companyId,
      section,
      payload,
    }: {
      companyId: string;
      section: CompanyUpdateSection;
      payload: Record<string, unknown>;
    }) => companyApi.update(companyId, section, payload),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });

  const uploadLogo = useMutation({
    mutationFn: ({ companyId, file }: { companyId: string; file: File }) =>
      companyApi.uploadLogo(companyId, file),
  });

  const updateEmailSlug = useMutation({
    mutationFn: ({ companyId, slug }: { companyId: string; slug: string }) =>
      companyApi.updateEmailSlug(companyId, slug),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });

  return { createCompany, updateCompany, uploadLogo, updateEmailSlug };
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, email }: { companyId: string; email: string }) =>
      companyApi.inviteMember(companyId, email),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["company-members", companyId],
      });
    },
  });
}

export function useCompanyMembers(companyId: string | null | undefined) {
  return useQuery<CompanyMember[]>({
    queryKey: ["company-members", companyId],
    queryFn: () => companyApi.listMembers(companyId!),
    enabled: !!companyId,
  });
}

export function useCheckEmailSlug(
  companyId: string | null | undefined,
  slug: string,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["email-slug-check", companyId, slug],
    queryFn: () => {
      if (!companyId || !slug) throw new Error("companyId and slug required");
      return companyApi.checkEmailSlug(companyId, slug);
    },
    enabled: enabled && !!companyId && slug.length >= 3,
    staleTime: 30_000,
    retry: false,
  });
}

export function useCompanyQuery(companyId: string | null | undefined) {
  return useQuery({
    queryKey: ["company", companyId],
    queryFn: () => {
      if (!companyId) throw new Error("No company ID provided");
      return companyApi.get(companyId);
    },
    enabled: !!companyId,
  });
}

/**
 * Fetches public company data exactly once per companyId for the entire
 * lifetime of the page. Module-level cache survives component re-mounts.
 */
export function usePublicCompanyQuery(companyId: string | null | undefined) {
  const [data, setData] = useState<Company | undefined>(() =>
    companyId ? publicCompanyCache.get(companyId) : undefined,
  );

  useEffect(() => {
    if (!companyId) return;

    const cached = publicCompanyCache.get(companyId);
    if (cached) {
      setData(cached);
      return;
    }

    if (publicCompanyPending.has(companyId)) return;
    publicCompanyPending.add(companyId);

    publicCompanyApi
      .get(companyId)
      .then((company) => {
        publicCompanyCache.set(companyId, company);
        setData(company);
      })
      .catch(() => {
        // Silently fail — company name is optional for the widget
      })
      .finally(() => {
        publicCompanyPending.delete(companyId);
      });
  }, [companyId]);

  return { data };
}
