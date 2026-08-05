/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";

import { ContactSection } from "@/components/landing/contact-section";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { CASE_STUDIES, getCaseStudyPlainDescription } from "@/lib/case-studies";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Case Studies — Swift Agents",
  description:
    "See how businesses use Swift Agents to automate support, resolve issues faster, and grow without hiring more agents.",
  alternates: {
    canonical: `${siteConfig.url}/en/case-studies`,
  },
};

export default function CaseStudiesPage() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="w-full px-6 pt-36 pb-16 md:px-10 md:pt-48 md:pb-20 lg:px-16 lg:pt-56 lg:pb-26">
          <div className="mx-auto max-w-360">
            <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-black/60 uppercase md:text-lg">
              HOW SWIFT AGENTS CAN HELP YOUR BUSINESS
            </p>
            <h1 className="font-greed-narrow mb-10 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase sm:text-5xl md:mb-14 md:text-[56px] lg:text-[66px]">
              CASE STUDIES
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
              {CASE_STUDIES.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.id}`}
                  className="group flex flex-col gap-5 rounded-[10px] border border-black/30 bg-[#F6F4EF]/50 p-6 transition-all hover:border-black hover:bg-[#F6F4EF] hover:shadow-[-3px_3px_0px_0px_#000000] md:p-8"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
                      <img
                        src={cs.logo}
                        alt={cs.name}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <h2 className="font-dm-mono text-lg font-medium tracking-[10%] text-black uppercase md:text-xl">
                      {cs.name}
                    </h2>
                  </div>
                  <p className="font-stolzl line-clamp-3 text-sm leading-[1.66] tracking-[2%] text-black/80 md:text-base">
                    {getCaseStudyPlainDescription(cs)}
                  </p>
                  <span className="font-dm-mono mt-auto text-sm font-medium tracking-[10%] text-black uppercase transition-transform group-hover:translate-x-1 md:text-base">
                    Read case study →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
