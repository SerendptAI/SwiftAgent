import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { CaseStudyDetail } from "@/components/landing/case-study-detail";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { routing } from "@/i18n/routing";
import {
  CASE_STUDIES,
  getCaseStudy,
  getCaseStudyMetaDescription,
} from "@/lib/case-studies";
import { localeAlternates } from "@/lib/locale-metadata";

interface CaseStudyPageProps {
  params: Promise<{ locale: string; caseStudyId: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_STUDIES.map((cs) => ({ locale, caseStudyId: cs.id })),
  );
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { locale, caseStudyId } = await params;
  setRequestLocale(locale);

  const caseStudy = getCaseStudy(caseStudyId);
  if (!caseStudy) return {};

  return {
    title: `${caseStudy.name} Case Study`,
    description: getCaseStudyMetaDescription(caseStudy),
    alternates: localeAlternates(locale, `/case-studies/${caseStudy.id}`),
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { locale, caseStudyId } = await params;
  setRequestLocale(locale);

  const caseStudy = getCaseStudy(caseStudyId);
  if (!caseStudy) notFound();

  return (
    <SmoothScrollProvider>
      <main className="font-jetbrains min-h-screen">
        <Navbar />
        <div className="w-full px-6 pt-36 pb-16 md:px-10 md:pt-48 md:pb-20 lg:px-16 lg:pt-56 lg:pb-26">
          <div className="mx-auto max-w-360">
            <Link
              href="/case-studies"
              className="mb-10 flex w-fit items-center gap-2 text-sm tracking-[2%] text-black/60 transition-colors hover:text-black md:mb-14 md:text-base"
            >
              ← All case studies
            </Link>

            <CaseStudyDetail caseStudy={caseStudy} />
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
