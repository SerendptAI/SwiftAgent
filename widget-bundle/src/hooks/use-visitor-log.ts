import axios from "axios";
import { useEffect } from "react";

import { localApiClient } from "../lib/api-client";

/**
 * Logs a visitor the first time the widget loads for a given company.
 * Uses sessionStorage to avoid re-logging on the same session.
 * Silently fails — visitor logging is non-critical.
 */
export function useVisitorLog(companyId: string) {
  useEffect(() => {
    const logVisitorIfNew = async () => {
      const sessionKey = `swift_agent_visited_${companyId}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        const { data: ipData } = await axios.get(
          "https://api.ipify.org?format=json",
        );
        if (ipData.ip) {
          await localApiClient.post("/api/visitors", {
            company_id: companyId,
            ip_address: ipData.ip,
          });
          sessionStorage.setItem(sessionKey, "true");
        }
      } catch {
        // Silently fail — visitor logging is non-critical
      }
    };

    logVisitorIfNew();
  }, [companyId]);
}
