import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  IngestKnowledgePayload,
  QueryKnowledgePayload,
} from "@/services/knowledge";
import { knowledgeApi } from "@/services/knowledge";

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

export function useQueryKnowledge() {
  return useMutation({
    mutationFn: (payload: QueryKnowledgePayload) =>
      knowledgeApi.queryKnowledge(payload),
  });
}
