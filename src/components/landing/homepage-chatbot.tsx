"use client";

import { useEffect } from "react";

const CHATBOT_SCRIPT_ID = "swift-agents-homepage-chatbot";
const CHATBOT_SCRIPT_SRC = "https://widget.swiftagents.org/dist/widget-ui.js";
const CHATBOT_COMPANY_ID = "1e1bccc0-40a5-4700-a5e2-0dd55cddb75c";
const CHATBOT_API_KEY =
  "swa_live_fdd8fe9d203494f23a19481403550ca5ded6a099b45a01a63a5b4867febf38cd";
const CHATBOT_BASE_URL = "https://widget.swiftagents.org";

const CHATBOT_DOM_SELECTORS = [
  `script[src="${CHATBOT_SCRIPT_SRC}"]`,
  'iframe[src*="widget.swiftagents.org"]',
  '[id*="swift-agent" i]',
  '[class*="swift-agent" i]',
  '[id*="swiftagents" i]',
  '[class*="swiftagents" i]',
  "[data-swift-agent-widget]",
  "[data-swift-agent-root]",
  "[data-swiftagents-widget]",
];

export function cleanupChatbotDom() {
  document
    .querySelectorAll(CHATBOT_DOM_SELECTORS.join(","))
    .forEach((element) => element.remove());
}

export function HomepageChatbot() {
  useEffect(() => {
    cleanupChatbotDom();

    const script = document.createElement("script");
    script.id = CHATBOT_SCRIPT_ID;
    script.src = CHATBOT_SCRIPT_SRC;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.dataset.companyId = CHATBOT_COMPANY_ID;
    script.dataset.apiKey = CHATBOT_API_KEY;
    script.dataset.baseUrl = CHATBOT_BASE_URL;

    document.body.appendChild(script);

    return cleanupChatbotDom;
  }, []);

  return null;
}
