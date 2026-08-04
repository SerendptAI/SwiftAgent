import { cn } from "@/lib/utils";

export interface CaseStudyUseCase {
  title: string;
  description: string;
  /**
   * Walkthrough clip for this use case, played in the detail view. Optional
   * because the unpublished studies have no footage; the detail view falls
   * back to the static mockup.
   */
  video?: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  logo: string;
  mockup: string;
  description: string;
  /**
   * Orientation of this partner's clips. Written out in full so Tailwind picks
   * the classes up when it scans this file.
   */
  videoAspect: "aspect-[9/16]" | "aspect-video";
  useCases: CaseStudyUseCase[];
  /** Unpublished studies stay here for reference but are not served anywhere. */
  published: boolean;
}

const MOCKUP = "/images/products/swift-agents-sdk.svg";

const ALL_CASE_STUDIES: CaseStudy[] = [
  {
    id: "partyverse",
    name: "PARTYVERSE",
    logo: "/images/Referrals/logos/partyverse.png",
    mockup: MOCKUP,
    videoAspect: "aspect-video",
    published: false,
    description:
      "<strong>Partyverse</strong> is an app where people go to buy tickets to events but the user experience is made for those who already know the party they want to attend, not those who are confused or just want to attend anything",
    useCases: [
      {
        title: "TELL OUR BOT HOW YOU ARE FEELING",
        description:
          "Tell our bot what kind of party you'd like to attend and it will bring out the best suggestions for the exact time frame you want",
      },
      {
        title: "SETTLE PAYMENT ISSUES",
        description:
          "Tell our bot what kind of party you'd like to attend and it will bring out the best suggestions for the exact time frame you want",
      },
      {
        title: "COMMUNICATE VIA CHAT NOT EMAIL",
        description:
          "Tell our bot what kind of party you'd like to attend and it will bring out the best suggestions for the exact time frame you want",
      },
    ],
  },
  {
    id: "kuda-bank",
    name: "KUDA BANK",
    logo: "/images/Referrals/logos/kuda.png",
    mockup: MOCKUP,
    videoAspect: "aspect-video",
    published: false,
    description:
      "<strong>Kuda Bank</strong> is a digital-first bank built for Africans, offering zero-fee banking, savings, and spending tools through a seamless mobile experience.",
    useCases: [
      {
        title: "RESOLVE ACCOUNT ACCESS ISSUES",
        description:
          "Help customers unlock their accounts, reset PINs, and verify identity without waiting for a human agent.",
      },
      {
        title: "ANSWER TRANSACTION QUERIES",
        description:
          "Instantly explain failed transactions, pending payments, and transfer limits to reduce inbound support load.",
      },
      {
        title: "GUIDE SAVINGS PRODUCT SETUP",
        description:
          "Walk customers through setting up savings targets, automated round-ups, and overdraft protection.",
      },
    ],
  },
  {
    id: "flutterwave",
    name: "FLUTTERWAVE",
    logo: "/images/Referrals/logos/flutterwave.png",
    mockup: MOCKUP,
    videoAspect: "aspect-video",
    published: false,
    description:
      "<strong>Flutterwave</strong> is a global payments technology company that enables businesses across Africa and beyond to accept and make payments with a single API.",
    useCases: [
      {
        title: "SUPPORT MERCHANT ONBOARDING",
        description:
          "Guide new merchants through KYC, account setup, and API integration so they can start accepting payments faster.",
      },
      {
        title: "HANDLE PAYOUT DISPUTES",
        description:
          "Automatically triage and respond to settlement queries, reducing time-to-resolution for payout disputes.",
      },
      {
        title: "EXPLAIN COMPLIANCE REQUIREMENTS",
        description:
          "Answer questions about documentation, country-specific regulations, and integration requirements at scale.",
      },
    ],
  },
  {
    id: "chowdeck",
    name: "CHOWDECK",
    logo: "/images/Referrals/logos/chowdeck.png",
    mockup: MOCKUP,
    description:
      "<strong>Chowdeck</strong> is a food delivery platform connecting hungry customers with their favourite restaurants across Nigerian cities, built for speed and reliability.",
    videoAspect: "aspect-[9/16]",
    published: true,
    useCases: [
      {
        title: "TURN COMMON QUESTIONS INTO INSTANT CONVERSATIONS",
        description:
          "A customer asking to change their delivery address gets the full answer in chat — what to do before the order is placed, how to reach support once it is already on its way, and when a fee adjustment applies.",
        video: "/videos/partners/chowdeck/common-questions.mp4",
      },
      {
        title: "REDUCE REPETITIVE SUPPORT WORK",
        description:
          "Order tracking, payment issues, delivery timelines and merchant availability are the same handful of questions over and over. Swift Agents resolves those instantly so human agents keep their attention on the complex cases.",
        video: "/videos/partners/chowdeck/repetitive-support.mp4",
      },
      {
        title: "DISCOVER THROUGH CONVERSATION",
        description:
          "Customers who do not know what they want can just ask. “Three breakfast options under ₦5,000” comes back as real dishes with vendors, prices and ratings, ready to order.",
        video: "/videos/partners/chowdeck/discover-meals.mp4",
      },
    ],
  },
  {
    id: "raenest",
    name: "RAENEST",
    logo: "/images/Referrals/logos/raenest.png",
    mockup: MOCKUP,
    description:
      "<strong>Raenest</strong> provides global financial tools for African professionals, including multi-currency accounts, USD cards, and cross-border payment solutions.",
    videoAspect: "aspect-video",
    published: true,
    useCases: [
      {
        title: "SIMPLIFY ACCOUNT SETUP & ONBOARDING",
        description:
          "New users are walked through verification in chat — which documents are accepted, why an upload was rejected for glare, a name mismatch or an expired proof of address, and exactly where in the dashboard to try again.",
        video: "/videos/partners/raenest/setup-onboarding.mp4",
      },
      {
        title: "BRING CLARITY TO CROSS-BORDER PAYMENTS",
        description:
          "International transfers raise questions before, during and after they land. “Has my payment been received?” is answered rather than queued — the agent collects the transaction reference, amount and date, then confirms the status back to the user.",
        video: "/videos/partners/raenest/payments.mp4",
      },
      {
        title: "KEEP USERS INFORMED EVERY STEP OF THE WAY",
        description:
          "Once a transfer clears, the agent confirms the funds reached the recipient and tells them how to find the money in their account. Support should bring trust, not uncertainty.",
        video: "/videos/partners/raenest/every-step.mp4",
      },
    ],
  },
];

/** Only published studies are listed, routed, or put in the sitemap. */
export const CASE_STUDIES: CaseStudy[] = ALL_CASE_STUDIES.filter(
  (cs) => cs.published,
);

export function getCaseStudy(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.id === id);
}

export function getCaseStudyPath(id: string): string {
  return `/case-studies/${id}`;
}

export function caseStudyChipClass(active: boolean): string {
  return cn(
    "font-dm-mono ml-1 flex w-fit shrink-0 items-center gap-3 rounded-[10px] border px-4 py-2.5 text-sm font-medium tracking-[10%] text-black uppercase transition-colors md:gap-6 md:text-base lg:text-lg xl:text-xl",
    active
      ? "border-black bg-[#F6F4EF] shadow-[-3px_3px_0px_0px_#000000]"
      : "border-black/30 bg-[#F6F4EF]/50 hover:border-black",
  );
}

export function getCaseStudyPlainDescription(caseStudy: CaseStudy): string {
  return caseStudy.description.replace(/<[^>]+>/g, "");
}
