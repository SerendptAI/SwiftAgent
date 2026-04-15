"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { Loader } from "@/components/loader";
import { getAccessToken } from "@/lib/api-client";
import { getCurrentUser, processAuthCallback } from "@/services/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double-execution in React Strict Mode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    async function handleCallback() {
      // DEBUG: Log everything about the current URL
      console.log("[AUTH CALLBACK] Full URL:", window.location.href);
      console.log("[AUTH CALLBACK] Search:", window.location.search);
      console.log("[AUTH CALLBACK] Hash:", window.location.hash);

      // 1. Extract tokens from URL — check query params first, then hash fragment
      let params = new URLSearchParams(window.location.search);

      // Some OAuth providers send tokens in the hash fragment instead
      if (!params.get("access_token") && window.location.hash) {
        params = new URLSearchParams(window.location.hash.substring(1));
        console.log("[AUTH CALLBACK] Tokens not in query, checking hash fragment");
      }

      console.log("[AUTH CALLBACK] URL params:", Object.fromEntries(params.entries()));
      console.log("[AUTH CALLBACK] access_token from URL:", params.get("access_token") ? "PRESENT" : "MISSING");
      console.log("[AUTH CALLBACK] refresh_token from URL:", params.get("refresh_token") ? "PRESENT" : "MISSING");

      const tokensFound = processAuthCallback(params);
      console.log("[AUTH CALLBACK] tokensFound:", tokensFound);
      console.log("[AUTH CALLBACK] localStorage access_token after save:", localStorage.getItem("access_token") ? "PRESENT" : "MISSING");
      console.log("[AUTH CALLBACK] localStorage refresh_token after save:", localStorage.getItem("refresh_token") ? "PRESENT" : "MISSING");

      if (!tokensFound && !getAccessToken()) {
        // No tokens in URL and no saved tokens — send to login
        console.log("[AUTH CALLBACK] No tokens found anywhere, redirecting to login");
        router.replace("/en/login");
        return;
      }

      // 2. Invalidate any stale user queries so the dashboard re-fetches
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      // 3. Fetch user profile to determine where to route
      try {
        const user = await getCurrentUser();
        console.log("[AUTH CALLBACK] User fetched:", user);

        // 4. Route based on onboarding status
        const needsOnboarding = !user.onboarding_completed;

        if (needsOnboarding) {
          console.log("[AUTH CALLBACK] Routing to onboarding");
          router.replace("/en/onboarding");
        } else {
          console.log("[AUTH CALLBACK] Routing to dashboard");
          router.replace("/en/dashboard");
        }
      } catch (err) {
        // Token is invalid or expired — send to login
        console.log("[AUTH CALLBACK] getCurrentUser failed:", err);
        router.replace("/en/login");
      }
    }

    handleCallback();
  }, [router, queryClient]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader />
    </div>
  );
}

