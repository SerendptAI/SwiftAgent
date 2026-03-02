import { apiClient } from "@/lib/api-client";

export interface KnowledgeDocument {
  id: string;
  company_id: string;
  category: string;
  filename: string;
  file_url: string;
  uploaded_at: string;
}

export const knowledgeApi = {
  uploadKnowledge: async (
    companyId: string,
    category: string,
    file: File,
  ): Promise<KnowledgeDocument> => {
    const formData = new FormData();
    formData.append("company_id", companyId);
    formData.append("category", category);
    formData.append("file", file);

    const { data } = await apiClient.post<KnowledgeDocument>(
      "/api/v1/knowledge/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  },
};
