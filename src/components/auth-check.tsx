"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Loader } from "@/components/loader";
import { useCurrentUser } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useCurrentUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute redirect target synchronously during render
  const redirectTo = (() => {
    if (isLoading) return null;
    if (isError || !user) return "/en/login";
    if (!user.onboarding_completed && pathname.includes("/dashboard"))
      return "/en/onboarding";
    return null;
  })();

  // Only side-effect: perform the navigation
  useEffect(() => {
    if (isMounted && redirectTo) router.replace(redirectTo);
  }, [redirectTo, router, isMounted]);

  if (!isMounted || isLoading) {
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
