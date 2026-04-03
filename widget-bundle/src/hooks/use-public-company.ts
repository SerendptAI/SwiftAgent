import { useQuery } from "@tanstack/react-query";

import { localApiClient } from "../lib/api-client";

interface Company {
  id: string;
  name: string;
  logo_url: string;
  website: string;
  industry: string;
  description: string;
  [key: string]: unknown;
}

export function usePublicCompanyQuery(companyId: string | null | undefined) {
  return useQuery({
    queryKey: ["public-company", companyId],
    queryFn: async () => {
      if (!companyId) throw new Error("No company ID provided");
      const { data } = await localApiClient.get<Company>(
        `/api/companies/${companyId}/public`,
      );
      return data;
    },
    enabled: !!companyId,
    retry: 1,
  });
}
