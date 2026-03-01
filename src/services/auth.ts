import { API_BASE_URL } from "@/lib/api-client";

export async function loginWithGoogle(redirectUrl?: string): Promise<void> {
  const params = new URLSearchParams();
  if (redirectUrl) {
    params.set("redirect_url", redirectUrl);
  }

  const url = `${API_BASE_URL}/api/v1/auth/login${params.toString() ? `?${params}` : ""}`;

  window.location.href = url;
}
