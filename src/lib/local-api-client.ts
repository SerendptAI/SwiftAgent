import axios from "axios";

/**
 * Lightweight axios client for calling Next.js API routes (same-origin).
 * No auth interceptors — these routes handle their own auth or proxy
 * to external services (ElevenLabs, ip-api, etc.).
 */
export const localApiClient = axios.create({
  baseURL: "",
  timeout: 30_000,
});
