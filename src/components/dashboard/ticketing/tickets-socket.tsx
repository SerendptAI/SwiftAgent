"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { API_BASE_URL, getAccessToken } from "@/lib/api-client";
import type { TicketListItem } from "@/services/tickets";

const MAX_RECONNECT_DELAY = 30000;

export function TicketsSocket() {
  const companyId = useActiveCompanyId();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAccessToken();
    if (!companyId || !token) return;

    const url = `${API_BASE_URL.replace(/^http/, "ws")}/api/v1/email/${companyId}/tickets/ws?token=${token}`;

    let ws: WebSocket | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    let stopped = false;

    const connect = () => {
      ws = new WebSocket(url);

      ws.onopen = () => {
        attempts = 0;
      };

      ws.onmessage = (event) => {
        const { items } = JSON.parse(event.data) as {
          items: TicketListItem[];
        };
        queryClient.setQueryData(["tickets", companyId], items);
      };

      ws.onclose = (event) => {
        if (stopped || event.code === 1008) return;
        attempts += 1;
        retryTimer = setTimeout(
          connect,
          Math.min(1000 * 2 ** attempts, MAX_RECONNECT_DELAY),
        );
      };
    };

    connect();

    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      ws?.close();
    };
  }, [companyId, queryClient]);

  return null;
}
