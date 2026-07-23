import type { Metadata } from "next";

import { AudienceSection } from "@/components/landing/affiliate/audience-section";
import { AffiliateHeroSection } from "@/components/landing/affiliate/hero-section";
import { PayoutSection } from "@/components/landing/affiliate/payout-section";
import { ProtocolSection } from "@/components/landing/affiliate/protocol-section";
import { ReferralPathSection } from "@/components/landing/affiliate/referral-path-section";
import { SubmitCtaSection } from "@/components/landing/affiliate/submit-cta-section";
import { ContactSection } from "@/components/landing/contact-section";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Affiliate Program — Swift Agents",
  description:
    "Refer businesses to Swift Agents and earn 20% of whichever plan they pay for. Introduce us, we build them a working AI agent, and you get paid once they go live.",
  alternates: {
    canonical: `${siteConfig.url}/en/affiliate`,
  },
};

export default function AffiliatePage() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-white">
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
