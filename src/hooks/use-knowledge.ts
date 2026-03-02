import { useMutation } from "@tanstack/react-query";

import { knowledgeApi } from "@/services/knowledge";

export function useUploadKnowledge() {
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
  });
}
