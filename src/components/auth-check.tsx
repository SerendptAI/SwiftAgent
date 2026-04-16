"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Loader } from "@/components/loader";
import { useCurrentUser } from "@/hooks/use-auth";
import { getAccessToken } from "@/lib/api-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    status,
    fetchStatus,
  } = useCurrentUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // The query is "busy" if it's loading, fetching, or if there's a token
  // but we haven't resolved user data yet (query was just enabled).
  const hasToken = typeof window !== "undefined" && !!getAccessToken();
  const isResolving =
    isLoading || isFetching || (hasToken && status === "pending");

  // Compute redirect target synchronously during render
  const redirectTo = (() => {
    if (isResolving) return null;

    // Not authenticated — send to login from any protected route
    // Only redirect if there's genuinely no token, or the query errored out
    if (!hasToken || isError) return "/en/login";
    if (!user) return "/en/login";

    // Onboarding incomplete — bounce out of dashboard
    if (!user.onboarding_completed && pathname.includes("/dashboard"))
      return "/en/onboarding";

    return null;
  })();

  // Only side-effect: perform the navigation
  useEffect(() => {
    if (isMounted && redirectTo) router.replace(redirectTo);
  }, [redirectTo, router, isMounted]);

  if (!isMounted || isResolving) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Block rendering while redirecting
  if (redirectTo) return null;

  return <>{children}</>;
}
