import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { getAccessToken } from "@/lib/api-client";
import type {
  OtpSendResponse,
  OtpVerifyResponse,
  RegisterInterestPayload,
  RegisterInterestResponse,
  RegistrationDetails,
  User,
} from "@/services/auth";
import {
  getCurrentUser,
  getRegistrationDetails,
  loginWithGoogle,
  logout,
  registerInterest,
  sendOtp,
  updateProfile,
  updateUserSecurity,
  verifyOtp,
} from "@/services/auth";

// ── Fetch & cache the current user ─────────────────────────────────────────────

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!getAccessToken(),
    // Retry transient failures, but not auth errors: a 401/403 means the
    // interceptor already attempted (and exhausted) a token refresh, so retrying
    // is pointless. This keeps a momentary network blip from logging the user out.
    retry: (failureCount, error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ── Trigger Google OAuth login ─────────────────────────────────────────────────

export function useGoogleLogin() {
  return useMutation({
    mutationFn: (locale?: string) => loginWithGoogle(locale),
  });
}

// ── Update User Profile ────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

// ── Update User Security (backup email + access code) ─────────────────────────

export function useUpdateUserSecurity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserSecurity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

// ── Send OTP ──────────────────────────────────────────────────────────────────

export function useSendOtp() {
  return useMutation<
    OtpSendResponse,
    Error,
    { email: string; isSignup?: boolean; fullName?: string }
  >({
    mutationFn: ({ email, isSignup, fullName }) =>
      sendOtp(email, isSignup, fullName),
  });
}

// ── Verify OTP ────────────────────────────────────────────────────────────────

export function useVerifyOtp() {
  return useMutation<
    OtpVerifyResponse,
    Error,
    { email: string; otpCode: string }
  >({
    mutationFn: ({ email, otpCode }) => verifyOtp(email, otpCode),
  });
}

// ── Register Interest ─────────────────────────────────────────────────────────

export function useRegisterInterest() {
  return useMutation<RegisterInterestResponse, Error, RegisterInterestPayload>({
    mutationFn: registerInterest,
  });
}

// ── Registration Details (post-approval prefill) ──────────────────────────────

export function useRegistrationDetails(enabled: boolean = true) {
  return useQuery<RegistrationDetails>({
    queryKey: ["registrationDetails"],
    queryFn: getRegistrationDetails,
    enabled: enabled && !!getAccessToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Logout and clear cache ─────────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locale?: string) => {
      queryClient.clear();
      logout(locale);
    },
  });
}
