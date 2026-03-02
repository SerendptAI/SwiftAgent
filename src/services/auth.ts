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
