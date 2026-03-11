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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#6433CC]">
      {/* ── Corner checkerboard decorations ─────────────────────── */}
      {/* Top-left */}
      <div className="absolute top-0 left-0 grid grid-cols-2 gap-0">
        <div className="h-24 w-24 bg-[#EDE8DC]" />
        <div className="h-24 w-24 bg-[#6433CC]" />
        <div className="h-24 w-24 bg-[#6433CC]" />
        <div className="h-24 w-24 bg-[#EDE8DC]" />
      </div>

      {/* Top-right partial */}
      <div className="absolute top-0 right-0 overflow-hidden">
        <div className="grid grid-cols-2 gap-0">
          <div className="h-24 w-24 bg-[#6433CC]" />
          <div className="h-24 w-24 bg-[#EDE8DC]" />
          <div className="h-24 w-24 bg-[#EDE8DC]" />
          <div className="h-24 w-24 bg-[#6433CC]" />
        </div>
      </div>

      {/* Bottom-left partial */}
      <div className="absolute bottom-0 left-0 overflow-hidden">
        <div className="grid grid-cols-2 gap-0">
          <div className="h-24 w-24 bg-[#6433CC]" />
          <div className="h-24 w-24 bg-[#EDE8DC]" />
          <div className="h-24 w-24 bg-[#EDE8DC]" />
          <div className="h-24 w-24 bg-[#6433CC]" />
        </div>
      </div>

      {/* Bottom-right */}
      <div className="absolute right-0 bottom-0 grid grid-cols-2 gap-0">
        <div className="h-24 w-24 bg-[#EDE8DC]" />
        <div className="h-24 w-24 bg-[#6433CC]" />
        <div className="h-24 w-24 bg-[#6433CC]" />
        <div className="h-24 w-24 bg-[#EDE8DC]" />
      </div>

      {/* ── Main card ────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        {/* Hat icon */}
        <div className="flex h-16 w-16 items-center justify-center">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Brim */}
            <rect x="4" y="32" width="48" height="8" rx="2" fill="white" />
            {/* Crown */}
            <rect x="16" y="12" width="24" height="22" rx="3" fill="white" />
            {/* Band */}
            <rect x="16" y="29" width="24" height="5" rx="1" fill="#6433CC" />
            {/* Top notch */}
            <rect x="24" y="8" width="8" height="6" rx="1" fill="white" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-stolzl text-3xl font-bold text-white">
          Enter your referral code
        </h1>

        {/* Subtitle */}
        <p className="font-dm-mono max-w-xs text-sm tracking-widest text-white/80 uppercase">
          Swift Agents is invite-only for now, but
          <br />
          we plan to open it to the public soon!
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-3"
        >
          <div className="flex w-full overflow-hidden rounded-xl bg-white shadow-lg">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              placeholder="XXXXX-XXXXX-XXXX-XXXX-XXXXXX"
              className="font-dm-mono min-w-0 flex-1 bg-transparent px-5 py-4 text-sm text-gray-800 placeholder-gray-300 outline-none"
              disabled={isLoading}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="font-dm-mono bg-[#E8521A] px-6 py-4 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-[#d14514] disabled:opacity-60"
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
