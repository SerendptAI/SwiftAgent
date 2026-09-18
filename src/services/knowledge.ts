import { apiClient } from "@/lib/api-client";

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

/** A list row. The list endpoint leaves out `content` and `metadata`. */
export interface KnowledgeEntrySummary {
  id: string;
  user_id: string;
  title: string;
  company_id: string | null;
  category: string | null;
  created_at: string;
}

export interface KnowledgeEntryPage {
  items: KnowledgeEntrySummary[];
  total: number;
  limit: number;
  skip: number;
  has_next: boolean;
}

export interface IngestKnowledgePayload {
  title: string;
  content: string;
  company_id: string;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeSearchResult {
  title: string;
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface QueryKnowledgePayload {
  query: string;
  company_id: string;
  limit?: number;
  threshold?: number;
}

export interface QueryKnowledgeResponse {
  results: KnowledgeSearchResult[];
  confidence: number;
  /** True when confidence is below the threshold and a human should step in. */
  escalate: boolean;
}

export const KNOWLEDGE_PAGE_SIZE = 20;

// Uploads can be much larger than JSON calls; give them a generous ceiling.
const UPLOAD_TIMEOUT_MS = 120_000;

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

  listDocuments: async (companyId: string): Promise<KnowledgeDocument[]> => {
    const { data } = await apiClient.get<
      | KnowledgeDocument[]
      | { documents?: KnowledgeDocument[]; items?: KnowledgeDocument[] }
    >("/api/v1/knowledge/", { params: { company_id: companyId } });

    if (Array.isArray(data)) return data;
    return data?.documents ?? data?.items ?? [];
  },

  /** One page of text entries, oldest first. */
  listEntries: async (
    companyId: string,
    skip: number,
    limit: number = KNOWLEDGE_PAGE_SIZE,
  ): Promise<KnowledgeEntryPage> => {
    const { data } = await apiClient.get<KnowledgeEntryPage>(
      "/api/v1/knowledge/",
      { params: { company_id: companyId, skip, limit } },
    );
    return data;
  },

  /** Semantic search over the company's knowledge base. */
  queryKnowledge: async (
    payload: QueryKnowledgePayload,
  ): Promise<QueryKnowledgeResponse> => {
    const { data } = await apiClient.post<QueryKnowledgeResponse>(
      "/api/v1/knowledge/query",
      payload,
    );
    return data;
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
