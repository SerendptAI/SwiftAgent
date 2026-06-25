/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface UseCase {
  title: string;
  description: string;
}

interface CaseStudy {
  id: string;
  name: string;
  logo: string;
  mockup: string;
  description: string;
  useCases: UseCase[];
}

const MOCKUP = "/images/products/swift-agents-sdk.svg";

const CASE_STUDIES: CaseStudy[] = [
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg
      width="18"
      height="21"
      viewBox="0 0 18 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M15.7521 7.89537C17.5345 9.08271 17.5345 11.7015 15.7521 12.8888L4.66325 20.2759C2.66952 21.6041 0 20.1748 0 17.7792V3.00496C0 0.609334 2.66952 -0.819931 4.66325 0.50824L15.7521 7.89537Z"
        fill="black"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z"
        stroke="black"
        stroke-width="1.5"
      />
      <path
        d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z"
        stroke="black"
        stroke-width="1.5"
      />
      <path
        d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z"
        stroke="black"
        stroke-width="1.5"
      />
      <path
        d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495"
        stroke="black"
        stroke-width="1.5"
      />
    </svg>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function DemoCaseStudiesSection() {
  const [activeId, setActiveId] = useState(CASE_STUDIES[0].id);
  const active =
    CASE_STUDIES.find((cs) => cs.id === activeId) ?? CASE_STUDIES[0];

  return (
    <section className="w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        {/* Header */}
        <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-black/60 uppercase md:text-lg">
          HOW SWIFT AGENTS CAN HELP YOUR BUSINESS
        </p>
        <h2 className="font-greed-narrow mb-10 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase sm:text-5xl md:mb-6 md:text-[56px] lg:text-[66px]">
          CASE STUDIES
        </h2>

        {/* Company tabs */}
        <div className="mb-10 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:mb-14 lg:mb-18 lg:gap-6 [&::-webkit-scrollbar]:hidden">
          {CASE_STUDIES.map((cs) => (
            <button
              key={cs.id}
              onClick={() => setActiveId(cs.id)}
              className={cn(
                "font-dm-mono ml-1 flex w-fit shrink-0 items-center gap-3 rounded-[10px] border px-4 py-2.5 text-sm font-medium tracking-[10%] text-black uppercase transition-colors md:gap-6 md:text-base lg:text-lg xl:text-xl",
                cs.id === activeId
                  ? "border-black bg-[#F6F4EF] shadow-[-3px_3px_0px_0px_#000000]"
                  : "border-black/30 bg-[#F6F4EF]/50 hover:border-black",
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
                <img
                  src={cs.logo}
                  alt={cs.name}
                  className="h-full w-full object-cover"
                />
              </span>
              {cs.name}
            </button>
          ))}
        </div>

        {/* Case study content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-18">
          {/* Left — app mockup */}
          <img
            src={active.mockup}
            alt={`${active.name} app screenshot`}
            className="aspect-571/701 w-full object-cover"
          />

          {/* Right — details */}
          <div className="flex flex-col justify-start">
            {/* Company name + share */}
            <div className="mb-6 flex items-center gap-6">
              <h3 className="font-greed-narrow text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase sm:text-5xl md:text-[56px] lg:text-[66px]">
                {active.name}
              </h3>
              <button
                aria-label="Share"
                className="mt-1 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#EDEDED] transition-all duration-200 hover:bg-[#EDEDED]"
              >
                <ShareIcon />
              </button>
            </div>

            {/* Description */}
            <div
              className="font-stolzl mb-8 text-sm leading-[1.66] tracking-[2%] text-black/80 md:text-base lg:text-lg"
              dangerouslySetInnerHTML={{ __html: active.description }}
            />

            {/* Use cases */}
            <p className="font-dm-mono mb-7 text-base leading-[1.2] font-medium tracking-[10%] text-black uppercase md:text-lg">
              HOW WE HELP?
            </p>
            <div className="flex flex-col gap-6 md:gap-8">
              {active.useCases.map((uc, i) => (
                <div key={i}>
                  <div className="mb-4 flex w-fit items-center gap-3 rounded-[10px] border border-black bg-[#F6F4EF] px-4 py-3 shadow-[-3px_3px_0px_0px_#000000] md:mb-6">
                    <PlayIcon />
                    <span className="font-dm-mono text-base font-medium tracking-[10%] text-black uppercase md:text-lg lg:text-xl">
                      {uc.title}
                    </span>
                  </div>
                  <p className="font-stolzl px-1 text-base leading-[1.76] tracking-[2%] text-black md:text-lg">
                    {uc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
