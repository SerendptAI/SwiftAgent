"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { useToast } from "@/components/ui/toast";
import { useSendOtp, useVerifyOtp } from "@/hooks/use-auth";
import type { OtpVerifyResponse } from "@/services/auth";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

interface OtpVerificationProps {
  /** The address the code was sent to; also the one it is verified against. */
  email: string;
  onVerified: (result: OtpVerifyResponse) => void;
  /** Returns to whichever step collected the email. */
  onChangeEmail: () => void;
}

/**
 * The code entry shared by signing in and signing up. Both reach it the same
 * way — an address is submitted, the backend emails a code — so the cooldown
 * starts on mount rather than waiting for a first resend, and a resend is an
 * ordinary send: by this point the address is registered either way.
 */
export function OtpVerification({
  email,
  onVerified,
  onChangeEmail,
}: OtpVerificationProps) {
  const t = useTranslations("login");
  const toast = useToast();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const [digits, setDigits] = useState<string[]>(() =>
    Array(OTP_LENGTH).fill(""),
  );
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  // Stays true across the handoff to the next page: the mutation settles the
  // moment verification succeeds, so keying off isPending alone would flash the
  // inputs back mid-navigation.
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const verify = useCallback(
    (code: string) => {
      setIsVerifying(true);
      setError("");

      verifyOtp.mutate(
        { email, otpCode: code },
        {
          onSuccess: onVerified,
          onError: () => {
            setIsVerifying(false);
            setError(t("incorrectOtp"));
          },
        },
      );
    },
    [email, onVerified, t, verifyOtp],
  );

  const handleResend = () => {
    if (sendOtp.isPending || cooldown > 0) return;
    sendOtp.mutate(
      { email },
      {
        onSuccess: () => {
          setDigits(Array(OTP_LENGTH).fill(""));
          setError("");
          setCooldown(RESEND_COOLDOWN_SECONDS);
          toast.success(t("codeResent"));
          inputRefs.current[0]?.focus();
        },
        onError: () => setError(t("otpSendFailed")),
      },
    );
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "")) verify(next.join(""));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    setError("");

    const firstEmpty = next.findIndex((d) => d === "");
    inputRefs.current[firstEmpty === -1 ? OTP_LENGTH - 1 : firstEmpty]?.focus();

    if (pasted.length === OTP_LENGTH) verify(pasted);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-14">
      <div className="flex items-center gap-2" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isVerifying}
            placeholder="*"
            aria-label={`Digit ${index + 1}`}
            className={`font-dm-mono focus:ring-ring/50 h-12 w-7.5 rounded-lg border bg-transparent text-center text-sm text-[#7E7E7E] placeholder-[#7E7E7E] transition-colors outline-none focus:ring-1 ${
              error ? "border-red-500" : "border-black/20"
            } ${isVerifying ? "opacity-60" : ""}`}
          />
        ))}
      </div>

      {/* Spam reminder — OTP emails are commonly filtered. */}
      {!isVerifying && !error && (
        <p className="font-dm-mono max-w-xs text-center text-xs leading-[1.4] text-[#7E7E7E]">
          {t("checkSpam")}
        </p>
      )}

      {isVerifying && (
        <p className="text-muted-foreground font-dm-mono text-sm leading-[1.2] tracking-[10%] uppercase">
          {t("signingIn")}
        </p>
      )}
      {error && (
        <p className="text-muted-foreground font-dm-mono text-sm leading-[1.2] tracking-[10%] uppercase">
          {error}
        </p>
      )}

      {!isVerifying && (
        <div className="flex items-center gap-3 max-md:flex-col">
          <button
            type="button"
            onClick={handleResend}
            disabled={sendOtp.isPending || cooldown > 0}
            className="text-muted-foreground font-dm-mono text-sm leading-[1.2] tracking-[10%] uppercase underline underline-offset-2 disabled:no-underline disabled:opacity-50"
          >
            {cooldown > 0
              ? `${t("resendCode")} (${cooldown}s)`
              : t("resendCode")}
          </button>
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-muted-foreground font-dm-mono text-sm leading-[1.2] tracking-[10%] uppercase underline underline-offset-2"
          >
            {t("backToEmail")}
          </button>
        </div>
      )}
    </div>
  );
}
