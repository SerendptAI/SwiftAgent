"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { Loader } from "@/components/loader";
import { useCurrentUser } from "@/hooks/use-auth";
import { useCompanyQuery } from "@/hooks/use-company";
import { identifyUser } from "@/lib/analytics";
import { getAccessToken } from "@/lib/api-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { data: user, isLoading, isError, status } = useCurrentUser();
  const [isMounted, setIsMounted] = useState(false);

  // Fall back to checking the active company's setup_complete when the
  // user-level onboarding_completed flag hasn't propagated yet.
  const { data: activeCompany } = useCompanyQuery(
    user && !user.onboarding_completed && user.company_id
      ? user.company_id
      : null,
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // React Query keeps `user` referentially stable, so this re-identifies only
  // when the user data actually changes.
  useEffect(() => {
    if (user) identifyUser(user);
  }, [user]);

  const hasToken = typeof window !== "undefined" && !!getAccessToken();
  const isResolving = isLoading || (hasToken && status === "pending" && !user);

  const redirectTo = (() => {
    if (isResolving) return null;
    if (!hasToken || isError || !user) return `/${locale}/login`;
    const onboardingDone =
      user.onboarding_completed || activeCompany?.setup_complete;
    if (!onboardingDone && pathname.includes("/dashboard")) {
      return `/${locale}/onboarding`;
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
