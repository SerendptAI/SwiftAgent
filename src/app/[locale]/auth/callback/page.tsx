"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";

import { Loader } from "@/components/loader";
import { getAccessToken } from "@/lib/api-client";
import { getCurrentUser, processAuthCallback } from "@/services/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    async function handleCallback() {
      // Tokens may arrive in either the query string or the hash fragment,
      // depending on the OAuth provider.
      let params = new URLSearchParams(window.location.search);
      if (!params.get("access_token") && window.location.hash) {
        params = new URLSearchParams(window.location.hash.substring(1));
      }

      const tokensFound = processAuthCallback(params);

      if (!tokensFound && !getAccessToken()) {
        router.replace(`/${locale}/login`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      try {
        const user = await getCurrentUser();
        const target = user.onboarding_completed ? "dashboard" : "onboarding";
        router.replace(`/${locale}/${target}`);
      } catch {
        router.replace(`/${locale}/login`);
      }
    }

    handleCallback();
  }, [router, queryClient, locale]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader />
    </div>
  );
}
