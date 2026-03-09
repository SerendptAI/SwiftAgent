import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api-client";
import type { User } from "@/services/auth";
import {
  getCurrentUser,
  loginWithGoogle,
  logout,
  updateProfile,
} from "@/services/auth";

// ── Fetch & cache the current user ─────────────────────────────────────────────

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!getAccessToken(),
    retry: false,
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
