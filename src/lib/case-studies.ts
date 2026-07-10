import { cn } from "@/lib/utils";

export interface CaseStudyUseCase {
  title: string;
  description: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  logo: string;
  mockup: string;
  description: string;
  useCases: CaseStudyUseCase[];
}

const MOCKUP = "/images/products/swift-agents-sdk.svg";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "partyverse",
    name: "PARTYVERSE",
    logo: "/images/Referrals/logos/partyverse.png",
    mockup: MOCKUP,
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
    useCases: [
      {
        title: "TRACK AND UPDATE ORDER STATUS",
        description:
          "Give customers real-time order updates and proactively handle delays before they need to contact support.",
      },
      {
        title: "PROCESS REFUND REQUESTS",
        description:
          "Automate refund eligibility checks and initiate credits instantly based on order and delivery data.",
      },
      {
        title: "HELP RESTAURANTS MANAGE MENUS",
        description:
          "Let restaurant partners update availability, pricing, and hours through a conversational interface.",
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
    useCases: [
      {
        title: "EXPLAIN MULTI-CURRENCY ACCOUNTS",
        description:
          "Help users understand how to hold, convert, and spend across USD, GBP, EUR, and NGN accounts.",
      },
      {
        title: "SUPPORT CARD FREEZE AND DISPUTES",
        description:
          "Let users instantly freeze cards, report fraud, and initiate chargebacks through the chat interface.",
      },
      {
        title: "GUIDE WITHDRAWAL WORKFLOWS",
        description:
          "Walk users through local and international withdrawal options, fees, and processing times.",
      },
    ],
  },
];

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
