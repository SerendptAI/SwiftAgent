"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getAccessToken, getCurrentUser, setAuthTokens } from "@/services/auth";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!getAccessToken() || !!searchParams.get("access_token"),
    retry: false,
  });

  useEffect(() => {
    // 1. Check for tokens in the URL
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      setAuthTokens(accessToken, refreshToken);

      // Clean up the URL by removing the tokens
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("access_token");
      newUrl.searchParams.delete("refresh_token");
      newUrl.searchParams.delete("token_type");

      // Use replace so we don't add the messy URL to the browser history
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [searchParams, router]);

  useEffect(() => {
    // 2. Handle Routing based on user state
    if (!isLoading) {
      if (error || !user) {
        // If not logged in and not on login page, redirect to login
        if (!pathname.includes("/login")) {
          // You might need to adjust this depending on if there are public routes
          router.replace("/en/login");
        }
      } else if (user) {
        // We have a user! Check if they need onboarding
        const needsOnboarding = !user.onboarding_completed; // You can adjust this condition

        if (needsOnboarding && !pathname.includes("/onboarding")) {
          router.replace("/en/onboarding");
        } else if (!needsOnboarding && pathname.includes("/login")) {
          router.replace("/en/dashboard");
        }
      }
      setIsInitializing(false);
    }
  }, [user, isLoading, error, pathname, router]);

  // Show nothing or a loading spinner while we figure out who the user is
  if (isInitializing || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
