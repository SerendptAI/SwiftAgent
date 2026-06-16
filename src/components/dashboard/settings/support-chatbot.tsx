"use client";

import { useEffect } from "react";

const SCRIPT_ID = "swift-agents-dashboard-support";
const SCRIPT_SRC = "https://widget.swiftagents.org/dist/widget-ui.js";
const COMPANY_ID = "1e1bccc0-40a5-4700-a5e2-0dd55cddb75c";
const API_KEY =
  "swa_live_fdd8fe9d203494f23a19481403550ca5ded6a099b45a01a63a5b4867febf38cd";
const BASE_URL = "https://widget.swiftagents.org";

/** Elements carrying this attribute open the support agent when clicked. */
export const SUPPORT_TRIGGER_SELECTOR = "[data-swift-agent-help]";

export function SupportChatbot() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.dataset.companyId = COMPANY_ID;
    script.dataset.apiKey = API_KEY;
    script.dataset.baseUrl = BASE_URL;
    script.dataset.mode = "button";
    script.dataset.trigger = SUPPORT_TRIGGER_SELECTOR;

    document.body.appendChild(script);
  }, []);

  return null;
}
