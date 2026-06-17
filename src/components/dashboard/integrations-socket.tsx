"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useToast } from "@/components/ui/toast";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { API_BASE_URL, getAccessToken } from "@/lib/api-client";

const MAX_RECONNECT_DELAY = 30000;

type IntegrationNotification = {
  type:
    | "integration_success"
    | "integration_warning"
    | "integration_error"
    | string;
  message: string;
};

export function IntegrationsSocket() {
  const companyId = useActiveCompanyId();
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAccessToken();
    if (!companyId || !token) return;

    const url = `${API_BASE_URL.replace(/^http/, "ws")}/api/v1/companies/${companyId}/integrations/ws?token=${token}`;

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
        let data: IntegrationNotification;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
        if (!data?.type) return;

        if (data.type === "integration_success") {
          toast.success(data.message);
        } else if (
          data.type === "integration_warning" ||
          data.type === "integration_error"
        ) {
          toast.error(data.message);
        }

        queryClient.invalidateQueries({
          queryKey: ["integrations", companyId],
        });
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
  }, [companyId, toast, queryClient]);

  return null;
}
