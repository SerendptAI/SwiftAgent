"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGoogleLogin } from "@/hooks/use-auth";

const REFERRAL_COOKIE = "referral_verified";

function hasReferralCookie() {
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${REFERRAL_COOKIE}=`));
}

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const googleLogin = useGoogleLogin();
  const [verified, setVerified] = useState(false);

  // Guard: must have passed the referral gate first
  useEffect(() => {
    if (!hasReferralCookie()) {
      router.replace("/invite");
    } else {
      setVerified(true);
    }
  }, [router]);

  const handleGoogleLogin = () => {
    googleLogin.mutate("en");
  };

  // Don't render login UI until referral cookie is confirmed
  if (!verified) return null;

  return (
    <div className="font-dm-mono container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center gap-6 space-y-10 sm:w-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.svg" alt="Logo" />

        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-1 text-left">
            <h3 className="text-muted-foreground font-stolzl text-xs font-medium tracking-wider uppercase">
              {t("welcomeBack")}
            </h3>
            <h2 className="font-stolzl text-xl font-semibold tracking-tight">
              {t("logInToYourAccount")}
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              variant="outline"
              className="text-muted-foreground h-12 w-full justify-start px-8 font-normal shadow-[-3px_3px_0px_0px_#000000]"
              onClick={handleGoogleLogin}
              disabled={googleLogin.isPending}
            >
              <Icons.google className="mr-3 h-5 w-5" />
              {googleLogin.isPending ? "Redirecting..." : t("googleLogin")}
            </Button>
            <Button
              variant="outline"
              className="text-muted-foreground h-12 w-full justify-start px-8 font-normal shadow-[-3px_3px_0px_0px_#000000]"
              disabled={googleLogin.isPending}
            >
              <Icons.serendpt className="mr-3 h-5 w-5" />
              {t("serendptLogin")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
