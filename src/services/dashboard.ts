import { apiClient } from "@/lib/api-client";

export interface DashboardStatItem {
  today: number;
  percent_change: number;
  last_7_days_up: number;
  last_7_days_down: number;
}

export interface DashboardChatsStatItem {
  answered: number;
  pending: number;
  last_7_days_up: number;
  last_7_days_down: number;
}

export interface DashboardStats {
  visitors: DashboardStatItem;
  chats: DashboardChatsStatItem;
  calls: DashboardStatItem;
  documents: DashboardStatItem;
  scrapes: DashboardStatItem;
}

export interface DashboardVisitor {
  id: string;
  company_id: string;
  visitor_id: string;
  country_code: string;
  duration_seconds: number;
  timestamp: string;
}

export const dashboardApi = {
  getStats: async (companyId: string): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>(
      `/api/v1/dashboard/${companyId}/stats`,
    );
    return data;
  },

  getVisitors: async (
    companyId: string,
    limit: number = 20,
  ): Promise<DashboardVisitor[]> => {
    // Route through our Next.js API to enrich visitors with geo data
    const { data } = await apiClient.get<DashboardVisitor[]>(
      "/api/visitors/geo",
      { baseURL: "", params: { companyId, limit } },
    );
    return data;
  },
};
