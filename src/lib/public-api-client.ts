import axios from "axios";

import { API_BASE_URL } from "./api-client";

console.log("[publicApiClient] Initializing with API_BASE_URL:", API_BASE_URL);

export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});
