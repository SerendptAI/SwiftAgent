"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { NextButton } from "./ui-elements";

export function CompletionStep() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Invalidate the cached user so AuthGuard reads fresh onboarding_completed: true
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  }, [queryClient]);

  const handleContinue = () => {
    router.push("/en/dashboard");
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-8 text-center">
      <h2 className="font-greed mb-4 text-3xl font-bold text-gray-900">
        We&apos;d love to get to know your
        <br />
        organization better.
      </h2>

      <p className="font-dm-mono mb-8 text-xs tracking-wider text-gray-500 uppercase">
        Our AI agents have a few questions for you so we
        <br />
        can understand your organization better
      </p>

      <div className="mb-8">
        <Image
          src="/images/complete.svg"
          alt="Questionnaire"
          width={150}
          height={150}
          className="h-auto w-auto"
        />
      </div>

      <p className="font-dm-mono mb-8 flex items-center gap-1.5 text-xs tracking-wider text-gray-400 uppercase">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Usually takes 5 minutes
      </p>

      <div className="w-full max-w-md">
        <NextButton onClick={handleContinue}>START QUESTIONER</NextButton>
      </div>
    </div>
  );
}
