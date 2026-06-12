"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useGoogleLogin, useSendOtp, useVerifyOtp } from "@/hooks/use-auth";

const OTP_LENGTH = 6;

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const toast = useToast();
  const { setTheme } = useTheme();
  const googleLogin = useGoogleLogin();
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

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleGoogleLogin = () => {
    googleLogin.mutate("en");
  };

  // Send OTP to email
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
          if (!data.otp_required) {
            // Grace period — already authenticated
            router.push("/en/dashboard");
            return;
          }
          setStep("otp");
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
    if (sendOtp.isPending) return;
    sendOtp.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setOtp(Array(OTP_LENGTH).fill(""));
          setOtpError("");
          toast.success(t("codeResent"));
          setTimeout(() => inputRefs.current[0]?.focus(), 50);
        },
        onError: () => {
          setOtpError(t("otpSendFailed"));
        },
      },
    );
  };

  // Verify OTP when all digits are filled
  const handleVerifyOtp = useCallback(
    async (code: string) => {
      setIsVerifying(true);
      setOtpError("");

      verifyOtp.mutate(
        { email: email.trim(), otpCode: code },
        {
          onSuccess: () => {
            router.push("/en/dashboard");
          },
          onError: (error: unknown) => {
            setIsVerifying(false);
            const status =
              error &&
              typeof error === "object" &&
              "response" in error &&
              (error as { response?: { status?: number } }).response?.status;
            if (status === 400) {
              setOtpError(t("incorrectOtp"));
            } else {
              setOtpError(t("incorrectOtp"));
            }
          },
        },
      );
    },
    [email, verifyOtp, router, t],
  );

  // Handle individual OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    const fullCode = newOtp.join("");
    if (fullCode.length === OTP_LENGTH && newOtp.every((d) => d !== "")) {
      handleVerifyOtp(fullCode);
    }
  };

  // Handle paste into OTP inputs
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

    // Focus the next empty input or the last one
    const nextEmpty = newOtp.findIndex((d) => d === "");
    inputRefs.current[nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty]?.focus();

    // Auto-submit if full
    if (pasted.length === OTP_LENGTH) {
      handleVerifyOtp(pasted);
    }
  };

  // Handle backspace navigation
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
              {/* OTP Input Boxes */}
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

              {/* Status text */}
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

              {/* Resend code + back to email */}
              {!isVerifying && (
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={sendOtp.isPending}
                    className="text-muted-foreground text-sm leading-[1.2] tracking-[10%] uppercase underline underline-offset-2 disabled:opacity-50"
                  >
                    {t("resendCode")}
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
