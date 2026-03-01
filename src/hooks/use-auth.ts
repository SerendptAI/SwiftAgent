import { useMutation } from "@tanstack/react-query";

import { loginWithGoogle } from "@/services/auth";

export function useGoogleLogin() {
  return useMutation({
    mutationFn: (redirectUrl?: string) => loginWithGoogle(redirectUrl),
  });
}
