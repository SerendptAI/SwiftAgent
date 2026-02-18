import Image from "next/image";
import Link from "next/link";

import { NextButton } from "./ui-elements";

export function CompletionStep() {
  return (
    <div className="flex h-4/5 w-full flex-col items-center justify-center text-center">
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
        <Link href="/dashboard" className="block w-full">
          <NextButton>Continue to Dashboard</NextButton>
        </Link>
      </div>
    </div>
  );
}
