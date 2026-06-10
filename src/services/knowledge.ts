import { apiClient } from "@/lib/api-client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface KnowledgeDocument {
  id: string;
  company_id: string;
  category: string;
  filename: string;
  file_url: string;
  uploaded_at: string;
}

export interface KnowledgeEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  company_id: string;
  category: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface IngestKnowledgePayload {
  title: string;
  content: string;
  company_id: string;
  category?: string;
  metadata?: Record<string, unknown>;
}

// Uploads can be much larger than JSON calls; give them a generous ceiling.
const UPLOAD_TIMEOUT_MS = 120_000;

// ── API ───────────────────────────────────────────────────────────────────────

export const knowledgeApi = {
  /**
   * Uploads a file (PDF/DOC/TXT/...) to be parsed and ingested as knowledge.
   * Backend stores the file in Cloudinary and extracts its content.
   */
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
        headers: { "Content-Type": "multipart/form-data" },
        timeout: UPLOAD_TIMEOUT_MS,
      },
    );
    return data;
  },

  /**
   * Lists all uploaded knowledge documents for a company.
   */
  listDocuments: async (companyId: string): Promise<KnowledgeDocument[]> => {
    const { data } = await apiClient.get<
      | KnowledgeDocument[]
      | { documents?: KnowledgeDocument[]; items?: KnowledgeDocument[] }
    >("/api/v1/knowledge/", { params: { company_id: companyId } });

    // The backend may return a bare array or wrap it (e.g. { documents: [...] }).
    if (Array.isArray(data)) return data;
    return data?.documents ?? data?.items ?? [];
  },

  /**
   * Ingests a text-based knowledge document (e.g. typed FAQ).
   */
  ingestDocument: async (
    payload: IngestKnowledgePayload,
  ): Promise<KnowledgeEntry> => {
    const { data } = await apiClient.post<KnowledgeEntry>(
      "/api/v1/knowledge/",
      payload,
    );
    return data;
  },
};
