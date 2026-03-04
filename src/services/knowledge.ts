import axios from "axios";

import { getAccessToken } from "@/lib/api-client";

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

    const token = getAccessToken();

    const { data } = await axios.post<KnowledgeDocument>(
      "/api/knowledge/upload",
      formData,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
    return data;
  },
};
