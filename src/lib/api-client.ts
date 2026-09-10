import axios from "axios";

import { routing } from "@/i18n/routing";
import { resetAnalytics } from "@/lib/analytics";
import { clearActiveCompany } from "@/store/active-company-store";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

const AUTH_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const AUTH_PROVIDER_KEY = "auth_provider";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_PROVIDER_KEY);
  clearActiveCompany();
  // Deliberate and forced logouts both funnel through here.
  resetAnalytics();
}

export function getAuthProvider(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_PROVIDER_KEY);
}

export function setAuthProvider(provider: "google" | "email") {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_PROVIDER_KEY, provider);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const REFRESH_URL = "/api/v1/auth/refresh";

// Separate client so the refresh call skips the interceptors and can't loop.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

function getLocaleFromPath(): string {
  if (typeof window === "undefined") return routing.defaultLocale;
  const segment = window.location.pathname.split("/")[1];
  return (routing.locales as readonly string[]).includes(segment)
    ? segment
    : routing.defaultLocale;
}

function forceLogout() {
  clearAuthTokens();
  if (typeof window === "undefined") return;

  const loginPath = `/${getLocaleFromPath()}/login`;
  if (window.location.pathname.replace(/\/+$/, "") === loginPath) return;

  window.location.href = loginPath;
}

const TRANSIENT_REFRESH_STATUSES: ReadonlySet<number> = new Set([408, 429]);

class RefreshRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshRejectedError";
  }
}

export function isRefreshRejection(error: unknown): boolean {
  if (error instanceof RefreshRejectedError) return true;
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  if (status === undefined) return false;

  return (
    status >= 400 && status < 500 && !TRANSIENT_REFRESH_STATUSES.has(status)
  );
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  }
  failedQueue = [];
}

async function requestNewTokens(
  refreshToken: string,
): Promise<{ access_token: string; refresh_token?: string }> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { data } = await refreshClient.post(REFRESH_URL, {
        refresh_token: refreshToken,
      });
      if (!data?.access_token) {
        throw new RefreshRejectedError(
          "The refresh response carried no access token.",
        );
      }
      return data;
    } catch (err) {
      lastError = err;
      if (isRefreshRejection(err)) throw err;
    }
  }
  throw lastError;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      !originalRequest ||
      status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes(REFRESH_URL)
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    // A refresh is already in flight — queue this request until it resolves.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest._retry = true;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const data = await requestNewTokens(refreshToken);

      const newAccessToken = data.access_token;
      const newRefreshToken = data.refresh_token ?? refreshToken;

      setAuthTokens(newAccessToken, newRefreshToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      if (isRefreshRejection(refreshError)) {
        forceLogout();
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// Detect plan-limit errors anywhere in the app and pop the upgrade modal.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const data = error?.response?.data;
    const detail =
      typeof data === "object" && data !== null
        ? (data as { detail?: unknown }).detail
        : undefined;
    const { isPlanLimitError, useUpgradeModalStore } =
      await import("@/store/upgrade-modal-store");
    if (isPlanLimitError(detail) || error?.response?.status === 402) {
      useUpgradeModalStore.getState().show();
    }
    return Promise.reject(error);
  },
);
