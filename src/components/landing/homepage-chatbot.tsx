"use client";

import { useEffect } from "react";

import { WIDGET_ORIGIN, WIDGET_SCRIPT_URL } from "@/lib/widget-embed";

const CHATBOT_SCRIPT_ID = "swift-agents-homepage-chatbot";
const CHATBOT_COMPANY_ID = "1e1bccc0-40a5-4700-a5e2-0dd55cddb75c";
const CHATBOT_API_KEY =
  "swa_live_fdd8fe9d203494f23a19481403550ca5ded6a099b45a01a63a5b4867febf38cd";

const CHATBOT_DOM_SELECTORS = [
  `script[src="${WIDGET_SCRIPT_URL}"]`,
  `iframe[src^="${WIDGET_ORIGIN}"]`,
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
    script.src = WIDGET_SCRIPT_URL;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.dataset.companyId = CHATBOT_COMPANY_ID;
    script.dataset.apiKey = CHATBOT_API_KEY;
    script.dataset.baseUrl = WIDGET_ORIGIN;

    document.body.appendChild(script);

    return cleanupChatbotDom;
  }, []);

  return null;
}
