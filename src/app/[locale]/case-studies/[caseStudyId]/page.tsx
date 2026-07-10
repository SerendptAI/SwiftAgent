/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyDetail } from "@/components/landing/case-study-detail";
import { ContactSection } from "@/components/landing/contact-section";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import {
  CASE_STUDIES,
  caseStudyChipClass,
  getCaseStudy,
  getCaseStudyPlainDescription,
} from "@/lib/case-studies";
import { siteConfig } from "@/lib/site-config";

interface CaseStudyPageProps {
  params: Promise<{ caseStudyId: string }>;
}

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ caseStudyId: cs.id }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { caseStudyId } = await params;
  const caseStudy = getCaseStudy(caseStudyId);
  if (!caseStudy) return {};

  return {
    title: `${caseStudy.name} Case Study — Swift Agents`,
    description: getCaseStudyPlainDescription(caseStudy),
    alternates: {
      canonical: `${siteConfig.url}/en/case-studies/${caseStudy.id}`,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { caseStudyId } = await params;
  const caseStudy = getCaseStudy(caseStudyId);
  if (!caseStudy) notFound();

  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="w-full px-6 pt-36 pb-16 md:px-10 md:pt-48 md:pb-20 lg:px-16 lg:pt-56 lg:pb-26">
          <div className="mx-auto max-w-360">
            <Link
              href="/case-studies"
              className="font-dm-mono mb-8 flex w-fit items-center gap-2 text-sm tracking-[10%] text-black/60 uppercase transition-colors hover:text-black md:mb-10 md:text-base"
            >
              ← All case studies
            </Link>

            <div className="mb-10 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:mb-14 lg:mb-18 lg:gap-6 [&::-webkit-scrollbar]:hidden">
              {CASE_STUDIES.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.id}`}
                  className={caseStudyChipClass(cs.id === caseStudy.id)}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
                    <img
                      src={cs.logo}
                      alt={cs.name}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  {cs.name}
                </Link>
              ))}
            </div>

            <CaseStudyDetail caseStudy={caseStudy} />
          </div>
        </div>
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
