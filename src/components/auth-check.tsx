"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { Loader } from "@/components/loader";
import { useCurrentUser } from "@/hooks/use-auth";
import { getAccessToken } from "@/lib/api-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    status,
  } = useCurrentUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasToken = typeof window !== "undefined" && !!getAccessToken();
  const isResolving =
    isLoading || isFetching || (hasToken && status === "pending");

  const redirectTo = (() => {
    if (isResolving) return null;
    if (!hasToken || isError || !user) return `/${locale}/login`;
    if (!user.onboarding_completed && pathname.includes("/dashboard")) {
      return `/${locale}/onboarding`;
    }
    if (user.onboarding_completed && pathname.includes("/onboarding")) {
      const isNewCompany =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).has("new_company");
      if (!isNewCompany) return `/${locale}/dashboard`;
    }
    return null;
  })();

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

  if (redirectTo) return null;

  return <>{children}</>;
}
