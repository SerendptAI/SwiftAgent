import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/landing/navbar";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-6 pt-[120px]">
        <section className="flex w-full flex-col items-center text-center">
          <Image
            src="/images/pixel-cat.svg"
            alt=""
            width={102}
            height={102}
            className="mb-8 aspect-102/102 w-full max-w-25.5 object-contain object-center"
            priority
          />

          <h1 className="font-dm-mono mb-8 text-center text-[26px] leading-[1.34] tracking-[-2px] text-black/60 uppercase">
            YOU ARE LOST
          </h1>

          <Link
            href="/"
            className="font-dm-mono flex h-9 w-full max-w-81.5 items-center justify-center rounded-[13px] border border-[#EDEDED] bg-[#006BE5] text-center text-sm leading-none font-medium text-white uppercase"
          >
            BACK TO HOMEPAGE
          </Link>
        </section>
      </main>
    </div>
  );
}
