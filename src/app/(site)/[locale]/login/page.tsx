"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

import { useToast } from "@/components/ui/toast";
import { useSendOtp, useVerifyOtp } from "@/hooks/use-auth";
// The locale-aware router prefixes the active locale, so destinations here are
// written unprefixed rather than pinned to one language.
import { useRouter } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";

const OTP_LENGTH = 6;

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const toast = useToast();
  const { setTheme } = useTheme();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  // Login is pre-auth — always render in light theme so a previously
  // persisted dark preference doesn't blacken the page.
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCooldown]);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      setEmailError(t("invalidEmail"));
      return;
    }
    setEmailError("");

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
          setResendCooldown(30);
          // Remind users to check spam — OTP emails are commonly filtered.
          toast.success(t("checkSpam"));
          // Focus the first OTP input after transition
          setTimeout(() => inputRefs.current[0]?.focus(), 50);
        },
        onError: () => {
          setEmailError(t("otpSendFailed"));
        },
      },
    );
  };

  const handleResendOtp = () => {
    if (sendOtp.isPending || resendCooldown > 0) return;
    sendOtp.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setOtp(Array(OTP_LENGTH).fill(""));
          setOtpError("");
          setResendCooldown(30);
          toast.success(t("codeResent"));
          setTimeout(() => inputRefs.current[0]?.focus(), 50);
        },
        onError: () => {
          setOtpError(t("otpSendFailed"));
        },
      },
    );
  };

  const handleVerifyOtp = useCallback(
    async (code: string) => {
      setIsVerifying(true);
      setOtpError("");

      verifyOtp.mutate(
        { email: email.trim(), otpCode: code },
        {
          onSuccess: () => {
            trackEvent("login_completed", { method: "email" });
            router.push("/dashboard");
          },
          onError: () => {
            setIsVerifying(false);
            setOtpError(t("incorrectOtp"));
          },
        },
      );
    },
    [email, verifyOtp, router, t],
  );

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join("");
    if (fullCode.length === OTP_LENGTH && newOtp.every((d) => d !== "")) {
      handleVerifyOtp(fullCode);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    setOtpError("");

    const nextEmpty = newOtp.findIndex((d) => d === "");
    inputRefs.current[nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty]?.focus();

    if (pasted.length === OTP_LENGTH) {
      handleVerifyOtp(pasted);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="font-dm-mono flex min-h-screen w-full items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/newlogo.svg"
          alt="Logo"
          className="mb-11.5 h-14 w-14"
        />

        <div className="flex flex-col items-center gap-2.5 text-center">
          <h3 className="text-muted-foreground font-dm-mono text-sm font-normal tracking-[0.2em] uppercase">
            {t("welcomeBack")}
          </h3>
          <h2 className="font-stolzl text-2xl font-normal tracking-tight">
            {t("logInToYourAccount")}
          </h2>
        </div>

        <div className="flex w-full max-w-93 flex-col items-center gap-7">
          {step === "email" ? (
            <div className="w-full">
              <div
                className={`focus-within:ring-ring/50 relative flex h-11 w-full items-center rounded-md border bg-transparent px-[0.2rem] focus-within:ring-2 ${
                  emailError ? "border-red-500" : "border-black/20"
                }`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendOtp();
                  }}
                  placeholder={t("companyEmailPlaceholder")}
                  className="text-foreground placeholder:text-muted-foreground font-dm-mono h-full flex-1 bg-transparent text-center text-xs leading-[1.2] tracking-[10%] uppercase outline-none md:text-sm"
                />
                {email.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!isValidEmail(email) || sendOtp.isPending}
                    className="font-dm-mono h-9 shrink-0 rounded-sm bg-black px-2.5 text-xs leading-[1.2] font-medium tracking-[10%] text-white uppercase transition-opacity disabled:opacity-40 md:text-sm"
                  >
                    {t("signIn")}
                  </button>
                )}
              </div>
              {emailError && (
                <p className="mt-2 text-center text-[10px] tracking-widest text-red-500 uppercase">
                  {emailError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-14">
              <div className="flex items-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={isVerifying}
                    placeholder="*"
                    className={`font-dm-mono focus:ring-ring/50 h-12 w-7.5 rounded-lg border bg-transparent text-center text-sm text-[#7E7E7E] placeholder-[#7E7E7E] transition-colors outline-none focus:ring-1 ${
                      otpError ? "border-red-500" : "border-black/20"
                    } ${isVerifying ? "opacity-60" : ""}`}
                  />
                ))}
              </div>

              {/* Spam reminder — OTP emails are commonly filtered. */}
              {!isVerifying && !otpError && (
                <p className="font-dm-mono max-w-xs text-center text-xs leading-[1.4] text-[#7E7E7E]">
                  {t("checkSpam")}
                </p>
              )}

              {isVerifying && (
                <p className="text-muted-foreground text-sm leading-[1.2] tracking-[10%] uppercase">
                  {t("signingIn")}
                </p>
              )}
              {otpError && (
                <p className="text-muted-foreground text-sm leading-[1.2] tracking-[10%] uppercase">
                  {otpError}
                </p>
              )}

              {!isVerifying && (
                <div className="flex items-center gap-3 max-md:flex-col">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={sendOtp.isPending || resendCooldown > 0}
                    className="text-muted-foreground text-sm leading-[1.2] tracking-[10%] uppercase underline underline-offset-2 disabled:no-underline disabled:opacity-50"
                  >
                    {resendCooldown > 0
                      ? `${t("resendCode")} (${resendCooldown}s)`
                      : t("resendCode")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp(Array(OTP_LENGTH).fill(""));
                      setOtpError("");
                      setIsVerifying(false);
                    }}
                    className="text-muted-foreground text-sm leading-[1.2] tracking-[10%] uppercase underline underline-offset-2"
                  >
                    {t("backToEmail")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
