import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AudienceSection } from "@/components/landing/affiliate/audience-section";
import { AffiliateHeroSection } from "@/components/landing/affiliate/hero-section";
import { PayoutSection } from "@/components/landing/affiliate/payout-section";
import { ProtocolSection } from "@/components/landing/affiliate/protocol-section";
import { ReferralPathSection } from "@/components/landing/affiliate/referral-path-section";
import { SubmitCtaSection } from "@/components/landing/affiliate/submit-cta-section";
import { ContactSection } from "@/components/landing/contact-section";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { localeAlternates } from "@/lib/locale-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.affiliate" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, "/affiliate"),
  };
}

export default function AffiliatePage() {
  return (
    <SmoothScrollProvider>
      <main>
        <AffiliateHeroSection />
        <ReferralPathSection />
        <AudienceSection />
        <ProtocolSection />
        <PayoutSection />
        <SubmitCtaSection />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
