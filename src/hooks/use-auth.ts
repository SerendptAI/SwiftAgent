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
  updateUserName,
  updateUserSecurity,
  uploadUserPfp,
  verifyOtp,
} from "@/services/auth";
import { clearActiveCompany } from "@/store/active-company-store";

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!getAccessToken(),
    // Retry transient failures, but not auth errors (the interceptor already
    // tried to refresh) — keeps a network blip from logging the user out.
    retry: (failureCount, error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: (locale?: string) => loginWithGoogle(locale),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useUpdateUserName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserName,
    onSuccess: (data) => {
      queryClient.setQueryData<User | undefined>(["currentUser"], (prev) =>
        prev
          ? {
              ...prev,
              name: data.name,
              picture: data.picture ?? prev.picture,
            }
          : prev,
      );
    },
  });
}

export function useUploadUserPfp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadUserPfp,
    onSuccess: (data) => {
      queryClient.setQueryData<User | undefined>(["currentUser"], (prev) =>
        prev
          ? {
              ...prev,
              name: data.name ?? prev.name,
              picture: data.picture ?? prev.picture,
            }
          : prev,
      );
    },
  });
}

export function useUpdateUserSecurity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserSecurity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useSendOtp() {
  const queryClient = useQueryClient();
  return useMutation<
    OtpSendResponse,
    Error,
    { email: string; isSignup?: boolean; fullName?: string }
  >({
    mutationFn: ({ email, isSignup, fullName }) =>
      sendOtp(email, isSignup, fullName),
    onSuccess: (data) => {
      if (!data.otp_required && data.access_token) {
        clearActiveCompany();
        queryClient.clear();
      }
    },
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  return useMutation<
    OtpVerifyResponse,
    Error,
    { email: string; otpCode: string }
  >({
    mutationFn: ({ email, otpCode }) => verifyOtp(email, otpCode),
    onSuccess: () => {
      clearActiveCompany();
      queryClient.clear();
    },
  });
}

export function useRegisterInterest() {
  return useMutation<RegisterInterestResponse, Error, RegisterInterestPayload>({
    mutationFn: registerInterest,
  });
}

export function useRegistrationDetails(enabled: boolean = true) {
  return useQuery<RegistrationDetails>({
    queryKey: ["registrationDetails"],
    queryFn: getRegistrationDetails,
    enabled: enabled && !!getAccessToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locale?: string) => {
      queryClient.clear();
      logout(locale);
    },
  });
}
