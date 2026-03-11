"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { verifyReferral } from "@/services/auth";

const REFERRAL_COOKIE = "referral_verified";
const COOKIE_DAYS = 7;

function hasReferralCookie() {
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${REFERRAL_COOKIE}=`));
}

function setReferralCookie() {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${REFERRAL_COOKIE}=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export default function InvitePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already verified → skip straight to login
  useEffect(() => {
    if (hasReferralCookie()) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    setError(null);
    setIsLoading(true);
    try {
      await verifyReferral(trimmed);
      setReferralCookie();
      router.replace("/login");
    } catch {
      setError("Invalid referral code. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-start justify-center overflow-hidden bg-[#6433CC] pt-32">
      {/* ── Corner SVG decorations ─────────────────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Referrals/referral1.svg"
        alt=""
        className="absolute top-0 left-0"
        aria-hidden="true"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Referrals/referral2.svg"
        alt=""
        className="absolute right-0 bottom-0"
        aria-hidden="true"
      />

      {/* ── Main card ────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo_white.svg"
          alt="Swift Agents"
          className="h-16 w-16"
        />

        {/* Heading */}
        <h1 className="font-instrument text-3xl font-bold text-white">
          Enter your referral code
        </h1>

        {/* Subtitle */}
        <p className="font-dm-mono max-w-lg text-sm tracking-widest text-white/80 uppercase">
          Swift Agents is invite-only for now, but we plan to open it to the
          public soon!
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xl flex-col gap-3"
        >
          <div className="flex w-full overflow-hidden rounded-md bg-white p-2 shadow-md">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              placeholder="XXXXX-XXXXX-XXXX-XXXX-XXXXXX"
              className="font-dm-mono min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-gray-800 placeholder-gray-400 outline-none [text-decoration:none] placeholder:[text-decoration:none]"
              disabled={isLoading}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="font-dm-mono rounded-md border-0 bg-[#F25430] px-6 py-4 text-sm font-bold tracking-widest text-white uppercase shadow-[-3px_3px_0px_0px_#000000] ring-0 transition-colors outline-none hover:bg-[#d14514] focus:outline-none disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Checking...
                </span>
              ) : (
                "SUBMIT"
              )}
            </button>
          </div>

          {/* Inline error */}
          {error && (
            <p className="font-dm-mono animate-in fade-in slide-in-from-top-1 text-center text-sm text-red-200 duration-200">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
