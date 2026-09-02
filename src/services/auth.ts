import axios from "axios";

import {
  API_BASE_URL,
  apiClient,
  clearAuthTokens,
  setAuthProvider,
  setAuthTokens,
} from "@/lib/api-client";
import type { ScrapedCompanyData } from "@/services/company";

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
  backup_email?: string;
  access_code?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export function loginWithGoogle(locale: string = "en"): Promise<void> {
  const redirectUrl = `${window.location.origin}/${locale}/auth/callback`;

  const params = new URLSearchParams({ redirect_url: redirectUrl });
  const url = `${API_BASE_URL}/api/v1/auth/login?${params}`;

  window.location.href = url;

  // Never resolves — keeps the mutation pending while the browser navigates
  return new Promise(() => {});
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/api/v1/auth/me");
  return data;
}

export async function updateProfile(payload: {
  personal_email?: string;
  personal_phone?: string;
  name?: string;
  picture?: string;
}): Promise<User> {
  const { data } = await apiClient.patch<
    { status?: string; user?: User } | User
  >("/api/v1/auth/me", payload);
  // The handoff says this endpoint returns { status, user } — but earlier
  // versions returned the user directly. Handle both shapes.
  if ("user" in data && data.user) return data.user;
  return data as User;
}

interface NamePictureResponse {
  status?: string;
  name: string;
  picture?: string | null;
}

export async function updateUserName(
  name: string,
): Promise<NamePictureResponse> {
  const { data } = await apiClient.patch<NamePictureResponse>(
    "/api/v1/auth/me/name",
    { name },
  );
  return data;
}

export async function uploadUserPfp(file: File): Promise<NamePictureResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.patch<NamePictureResponse>(
    "/api/v1/auth/me/pfp",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function updateUserSecurity(payload: {
  backup_email?: string | null;
  access_code?: string | null;
}): Promise<User> {
  const { data } = await apiClient.patch<User>(
    "/api/v1/auth/me/security",
    payload,
  );
  return data;
}

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

/**
 * Signing in refuses an address that has no account. A 404 says so on its own;
 * a 400 is also used for ordinary validation failures, so its message has to be
 * read before the refusal is attributed to a missing account.
 */
const ACCOUNT_NOT_FOUND_PATTERN =
  /(no account|account (?:does not|doesn't) exist|not registered|user not found)/i;

/** True when signing in failed only because the address has no account yet. */
export function isAccountNotFoundError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  if (status === 404) return true;
  if (status !== 400) return false;

  const detail = error.response?.data?.detail;
  return typeof detail === "string" && ACCOUNT_NOT_FOUND_PATTERN.test(detail);
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
    setAuthProvider("email");
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
    setAuthProvider("email");
  }

  return data;
}

export function logout(locale: string = "en") {
  clearAuthTokens();
  window.location.href = `/${locale}/login`;
}

export interface RegisterInterestPayload {
  company_name: string;
  company_email: string;
  company_description: string;
  customer_size: string;
  /**
   * Optional to the backend, but the registration-time scrape that prefills
   * onboarding depends on it, so the form collects it for every registration.
   */
  company_website: string;
}

export interface RegisterInterestResponse {
  status: string;
  message: string;
}

/**
 * Creates the account and dispatches the sign-in code to `company_email`, so
 * the caller goes straight to code entry rather than waiting for an approval.
 */
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
  company_website: string | null;
  /**
   * Extracted from the company's website at registration, so onboarding opens
   * prefilled with no live scrape. Null when no website was given or the
   * extraction found nothing.
   */
  scraped_data: ScrapedCompanyData | null;
}

export async function getRegistrationDetails(): Promise<RegistrationDetails> {
  const { data } = await apiClient.get<RegistrationDetails>(
    "/api/v1/auth/registration-details",
  );
  return data;
}

export function processAuthCallback(searchParams: URLSearchParams): boolean {
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  if (accessToken && refreshToken) {
    setAuthTokens(accessToken, refreshToken);
    setAuthProvider("google");
    return true;
  }
  return false;
}
