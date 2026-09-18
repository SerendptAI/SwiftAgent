import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  IngestKnowledgePayload,
  KnowledgeDocument,
  KnowledgeEntryPage,
  QueryKnowledgePayload,
} from "@/services/knowledge";
import { knowledgeApi } from "@/services/knowledge";

export function useKnowledgeDocuments(companyId: string | null | undefined) {
  return useQuery<KnowledgeDocument[]>({
    queryKey: ["knowledge", companyId],
    queryFn: () => knowledgeApi.listDocuments(companyId!),
    enabled: !!companyId,
  });
}

const ENTRIES_KEY = "entries";

export function useKnowledgeEntries(companyId: string | null | undefined) {
  return useInfiniteQuery({
    queryKey: ["knowledge", companyId, ENTRIES_KEY],
    queryFn: ({ pageParam }) => knowledgeApi.listEntries(companyId!, pageParam),
    initialPageParam: 0,
    // Read the offset from the server's own page so an entry added to the
    // cache locally can't shift where the next page starts.
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.skip + lastPage.limit : undefined,
    enabled: !!companyId,
  });
}

export function useQueryKnowledge() {
  return useMutation({
    mutationFn: (payload: QueryKnowledgePayload) =>
      knowledgeApi.queryKnowledge(payload),
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
    onSuccess: (entry, { company_id }) => {
      // The list endpoint returns oldest first, so refetching would put a new
      // entry after the pages already loaded. Put it at the top of the cache.
      queryClient.setQueryData<InfiniteData<KnowledgeEntryPage, number>>(
        ["knowledge", company_id, ENTRIES_KEY],
        (data) => {
          if (!data) return data;
          const [first, ...rest] = data.pages;
          const summary = {
            id: entry.id,
            user_id: entry.user_id,
            title: entry.title,
            company_id: entry.company_id,
            category: entry.category,
            created_at: entry.created_at,
          };
          return {
            ...data,
            pages: [
              {
                ...first,
                items: [summary, ...first.items],
                total: first.total + 1,
              },
              ...rest,
            ],
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["knowledge", company_id],
        predicate: (query) => query.queryKey[2] !== ENTRIES_KEY,
      });
    },
  });
}
