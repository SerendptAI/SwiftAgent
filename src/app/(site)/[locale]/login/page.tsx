"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { OtpVerification } from "@/components/auth/otp-verification";
import { useToast } from "@/components/ui/toast";
import { useSendOtp } from "@/hooks/use-auth";
// The locale-aware router prefixes the active locale, so destinations here are
// written unprefixed rather than pinned to one language.
import { Link, useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { isAccountNotFoundError } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const toast = useToast();
  const { setTheme } = useTheme();
  const sendOtp = useSendOtp();

  // Login is pre-auth — always render in light theme so a previously
  // persisted dark preference doesn't blacken the page.
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [accountMissing, setAccountMissing] = useState(false);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSendOtp = () => {
    if (!isValidEmail(email)) {
      setEmailError(t("invalidEmail"));
      return;
    }
    setEmailError("");
    setAccountMissing(false);

    sendOtp.mutate(
      { email: email.trim() },
      {
        onSuccess: (data) => {
          trackEvent("login_otp_requested", {
            otp_required: data.otp_required,
          });

          if (!data.otp_required) {
            // Grace period — already authenticated
            trackEvent("login_completed", { method: "email" });
            router.push("/dashboard");
            return;
          }
          setStep("otp");
          // Remind users to check spam — OTP emails are commonly filtered.
          toast.success(t("checkSpam"));
        },
        onError: (error) => {
          // Registration is public, so an unknown address is an invitation to
          // sign up rather than a failure to report.
          if (isAccountNotFoundError(error)) {
            setAccountMissing(true);
            return;
          }
          setEmailError(t("otpSendFailed"));
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/newlogo.svg"
          alt="Logo"
          className="mb-11.5 h-14 w-14"
        />

        <div className="flex flex-col items-center gap-2.5 text-center">
          <h3 className="text-muted-foreground text-sm font-normal tracking-[2%] uppercase">
            {t("welcomeBack")}
          </h3>
          <h2 className="text-2xl font-normal tracking-tight">
            {t("logInToYourAccount")}
          </h2>
        </div>

        <div className="flex w-full max-w-93 flex-col items-center gap-7">
          {step === "email" ? (
            <div className="w-full">
              <div
                className={`focus-within:ring-ring/50 relative flex h-11 w-full items-center rounded-md border bg-transparent px-[0.2rem] focus-within:ring-2 ${
                  emailError || accountMissing
                    ? "border-red-500"
                    : "border-black/20"
                }`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                    if (accountMissing) setAccountMissing(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendOtp();
                  }}
                  placeholder={t("companyEmailPlaceholder")}
                  className="text-foreground placeholder:text-muted-foreground h-full flex-1 bg-transparent text-center text-xs leading-[1.2] tracking-[2%] outline-none md:text-sm"
                />
                {email.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!isValidEmail(email) || sendOtp.isPending}
                    className="h-9 shrink-0 rounded-sm bg-black px-2.5 text-xs leading-[1.2] font-medium tracking-[2%] text-white capitalize transition-opacity disabled:opacity-40 md:text-sm"
                  >
                    {t("signIn")}
                  </button>
                )}
              </div>

              {emailError && (
                <p className="mt-2 text-center text-[10px] tracking-[2%] text-red-500">
                  {emailError}
                </p>
              )}

              {accountMissing && (
                <div className="mt-3 flex flex-col items-center gap-2 text-center">
                  <p className="text-[10px] tracking-[2%] text-red-500">
                    {t("accountNotFound")}
                  </p>
                  <Link
                    href="/signup"
                    className="text-foreground text-xs leading-[1.2] tracking-[2%] capitalize underline underline-offset-4"
                  >
                    {t("createAccount")}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <OtpVerification
              email={email.trim()}
              onVerified={() => {
                trackEvent("login_completed", { method: "email" });
                router.push("/dashboard");
              }}
              onChangeEmail={() => setStep("email")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
