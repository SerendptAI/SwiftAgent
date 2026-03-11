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
    <div className="flex h-4/5 w-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-8">
        <Image
          src="/images/complete.svg"
          alt="Setup Complete"
          width={120}
          height={120}
          className="h-auto w-auto"
        />
      </div>

      <h2 className="mb-12 text-sm font-bold tracking-wide text-gray-900 uppercase">
        COMPANY SETUP COMPLETE
      </h2>

      <div className="mt-8 w-full max-w-2xl px-12">
        <NextButton onClick={handleContinue}>Continue to Dashboard</NextButton>
      </div>
    </div>
  );
}
