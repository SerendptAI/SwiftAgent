"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { Loader } from "@/components/loader";
import { getAccessToken } from "@/lib/api-client";
import { getCurrentUser, processAuthCallback } from "@/services/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double-execution in React Strict Mode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    async function handleCallback() {
      // 1. Extract tokens from URL and save to localStorage
      const params = new URLSearchParams(window.location.search);
      const tokensFound = processAuthCallback(params);

      if (!tokensFound && !getAccessToken()) {
        // No tokens in URL and no saved tokens — send to login
        router.replace("/en/login");
        return;
      }

      // 2. Fetch user profile to determine where to route
      try {
        const user = await getCurrentUser();

        // 3. Route based on onboarding status
        const needsOnboarding = !user.onboarding_completed;

        if (needsOnboarding) {
          router.replace("/en/onboarding");
        } else {
          router.replace("/en/dashboard");
        }
      } catch {
        // Token is invalid or expired — send to login
        router.replace("/en/login");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader />
    </div>
  );
}
