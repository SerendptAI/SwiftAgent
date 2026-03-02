import { API_BASE_URL } from "@/lib/api-client";

export async function loginWithGoogle(redirectUrl?: string): Promise<void> {
  const params = new URLSearchParams();
  if (redirectUrl) {
    // Ensure the redirect URL is absolute (e.g. http://localhost:3000/en/dashboard)
    const absoluteRedirectUrl = redirectUrl.startsWith("/")
      ? `${window.location.origin}${redirectUrl}`
      : redirectUrl;
    params.set("redirect_url", absoluteRedirectUrl);
  }

  const url = `${API_BASE_URL}/api/v1/auth/login${params.toString() ? `?${params}` : ""}`;

  window.location.href = url;

  // Return a promise that never resolves to keep the mutation in a pending state
  // while the browser navigates to the redirect URL.
  return new Promise(() => {});
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }
}

export function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

export function clearAuthTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

export async function getCurrentUser() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      clearAuthTokens();
    }
    throw new Error("Failed to fetch user details");
  }

  return res.json();
}
