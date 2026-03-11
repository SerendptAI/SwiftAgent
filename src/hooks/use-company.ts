import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CompanyUpdateSection } from "@/services/company";
import { companyApi } from "@/services/company";

export function useCompaniesQuery() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => companyApi.list(),
  });
}

export function useCompanyMutations() {
  const queryClient = useQueryClient();

  const createCompany = useMutation({ mutationFn: companyApi.create });

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

  return { createCompany, updateCompany, uploadLogo };
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
