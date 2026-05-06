import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  IngestKnowledgePayload,
  KnowledgeDocument,
} from "@/services/knowledge";
import { knowledgeApi } from "@/services/knowledge";

export function useKnowledgeDocuments(companyId: string | null | undefined) {
  return useQuery<KnowledgeDocument[]>({
    queryKey: ["knowledge", companyId],
    queryFn: () => knowledgeApi.listDocuments(companyId!),
    enabled: !!companyId,
  });
}

export function useUploadKnowledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      category,
      file,
    }: {
      companyId: string;
      category: string;
      file: File;
    }) => knowledgeApi.uploadKnowledge(companyId, category, file),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge", companyId] });
    },
  });
}

export function useIngestKnowledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IngestKnowledgePayload) =>
      knowledgeApi.ingestDocument(payload),
    onSuccess: (_, { company_id }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge", company_id] });
    },
  });
}
