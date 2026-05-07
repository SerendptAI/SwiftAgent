import {
  API_BASE_URL,
  apiClient,
  clearAuthTokens,
  setAuthTokens,
} from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  auth_provider?: string;
  company_id?: string;
  login_method?: string;
  onboarding_completed?: boolean;
  personal_email?: string;
  personal_phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// ── Google Login ───────────────────────────────────────────────────────────────

export function loginWithGoogle(locale: string = "en"): Promise<void> {
  const redirectUrl = `${window.location.origin}/${locale}/auth/callback`;

  const params = new URLSearchParams({ redirect_url: redirectUrl });
  const url = `${API_BASE_URL}/api/v1/auth/login?${params}`;

  window.location.href = url;

  // Never resolves — keeps the mutation pending while the browser navigates
  return new Promise(() => {});
}

// ── User API ───────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/api/v1/auth/me");
  return data;
}

export async function updateProfile(payload: {
  personal_email?: string;
  personal_phone?: string;
}): Promise<User> {
  const { data } = await apiClient.patch<User>("/api/v1/auth/me", payload);
  return data;
}

// ── OTP Authentication ────────────────────────────────────────────────────────

export interface OtpSendResponse {
  message: string;
  email: string;
  otp_required: boolean;
  is_new_user: boolean;
  access_token: string | null;
  refresh_token: string | null;
}

export interface OtpVerifyResponse {
  message: string;
  email: string;
  otp_required: boolean;
  is_new_user: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export async function sendOtp(
  email: string,
  isSignup: boolean = false,
  fullName?: string,
): Promise<OtpSendResponse> {
  const { data } = await apiClient.post<OtpSendResponse>(
    "/api/v1/auth/otp/send",
    {
      email,
      is_signup: isSignup,
      ...(fullName ? { full_name: fullName } : {}),
    },
  );

  // Handle grace period — tokens returned directly
  if (!data.otp_required && data.access_token && data.refresh_token) {
    setAuthTokens(data.access_token, data.refresh_token);
  }

  return data;
}

export async function verifyOtp(
  email: string,
  otpCode: string,
): Promise<OtpVerifyResponse> {
  const { data } = await apiClient.post<OtpVerifyResponse>(
    "/api/v1/auth/otp/verify",
    { email, otp_code: otpCode },
  );

  if (data.access_token && data.refresh_token) {
    setAuthTokens(data.access_token, data.refresh_token);
  }

  return data;
}

// ── Token Refresh ──────────────────────────────────────────────────────────────

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/api/v1/auth/refresh", {
    refresh_token: refreshToken,
  });
  return data;
}

// ── Logout ─────────────────────────────────────────────────────────────────────

export function logout(locale: string = "en") {
  clearAuthTokens();
  window.location.href = `/${locale}/login`;
}

// ── Referral ───────────────────────────────────────────────────────────────────

export async function verifyReferral(code: string): Promise<string> {
  const { data } = await apiClient.post<string>(
    "/api/v1/auth/verify-referral",
    { code },
  );
  return data;
}

// ── Registration / Approval ───────────────────────────────────────────────────

export interface RegisterInterestPayload {
  company_name: string;
  company_email: string;
  company_description: string;
  customer_size: string;
}

export interface RegisterInterestResponse {
  status: string;
  message: string;
}

export async function registerInterest(
  payload: RegisterInterestPayload,
): Promise<RegisterInterestResponse> {
  const { data } = await apiClient.post<RegisterInterestResponse>(
    "/api/v1/auth/register-interest",
    payload,
  );
  return data;
}

export interface RegistrationDetails {
  company_name: string;
  company_description: string;
  customer_size: string;
}

export async function getRegistrationDetails(): Promise<RegistrationDetails> {
  const { data } = await apiClient.get<RegistrationDetails>(
    "/api/v1/auth/registration-details",
  );
  return data;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export function processAuthCallback(searchParams: URLSearchParams): boolean {
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  if (accessToken && refreshToken) {
    setAuthTokens(accessToken, refreshToken);
    return true;
  }
  return false;
}
