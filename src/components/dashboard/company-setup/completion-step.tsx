"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { NextButton } from "./ui-elements";

export function CompletionStep() {
  const router = useRouter();

  /* TODO: restore when API submission is re-enabled
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  }, [queryClient]);
  */

  const handleContinue = () => {
    router.push("/en/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="absolute inset-y-0 right-[350px] left-0 flex items-center justify-center p-6 lg:left-[105px]">
        <div className="flex w-full max-w-2xl flex-col items-center bg-white px-14 py-16 text-center shadow-xl">
          <h2 className="font-greed-narrow mb-4 text-4xl font-bold text-gray-900">
            We&apos;d love to get to know your
            <br />
            organization better.
          </h2>

          <p className="font-dm-mono mb-6 text-sm tracking-wider text-gray-500 uppercase">
            Our AI agents have a few questions for you so we
            <br />
            can understand your organization better
          </p>

          <div className="mb-6">
            <Image
              src="/images/pixellife.svg"
              alt="Questionnaire"
              width={120}
              height={120}
              className="h-auto w-auto"
            />
          </div>

          <p className="font-dm-mono mb-8 flex items-center gap-1.5 text-[10px] tracking-wider text-gray-400 uppercase">
            <svg
              className="h-3.5 w-3.5"
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

          <div className="w-full max-w-xs">
            <NextButton onClick={handleContinue}>START QUESTIONER</NextButton>
          </div>
        </div>
      </div>
    </div>
  );
}
