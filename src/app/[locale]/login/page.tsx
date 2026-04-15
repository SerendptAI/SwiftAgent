"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
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
  const [email, setEmail] = useState("");

  // Guard: must have passed the referral gate first
  useEffect(() => {
    // if (!hasReferralCookie()) {
    //   router.replace("/invite");
    // } else {
    //   setVerified(true);
    // }
    setVerified(true);
  }, [router]);

  const handleGoogleLogin = () => {
    googleLogin.mutate("en");
  };

  if (!verified) return null;

  return (
    <div className="font-dm-mono flex min-h-screen w-full items-start justify-center px-4 pt-24 sm:pt-32">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/newlogo.svg" alt="Logo" className="h-14 w-14" />

        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-muted-foreground font-stolzl text-[11px] font-normal tracking-[0.2em] uppercase">
            {t("welcomeBack")}
          </h3>
          <h2 className="font-stolzl text-xl font-normal tracking-tight">
            {t("logInToYourAccount")}
          </h2>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full items-center justify-center gap-3">
            <Button
              variant="outline"
              className="text-muted-foreground font-dm-mono h-11 flex-1 text-[10px] font-normal tracking-[0.15em] uppercase shadow-[-3px_3px_0px_0px_#000000]"
              onClick={handleGoogleLogin}
              disabled={googleLogin.isPending}
            >
              {t("googleLogin")}
              <Icons.google className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="text-muted-foreground font-dm-mono h-11 flex-1 text-[10px] font-normal tracking-[0.15em] uppercase shadow-[-3px_3px_0px_0px_#000000]"
              disabled={googleLogin.isPending}
            >
              {t("serendptLogin")}
              <Icons.serendpt className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <span className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase">
            {t("or")}
          </span>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("companyEmailPlaceholder")}
            className="text-muted-foreground placeholder:text-muted-foreground focus:ring-ring/50 h-11 w-full rounded-md border border-black/20 bg-transparent px-4 text-[11px] tracking-[0.2em] uppercase outline-none focus:ring-2"
          />
        </div>
      </div>
    </div>
  );
}
