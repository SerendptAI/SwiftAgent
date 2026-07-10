/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import { CaseStudyDetail } from "@/components/landing/case-study-detail";
import { CASE_STUDIES, caseStudyChipClass } from "@/lib/case-studies";

export function DemoCaseStudiesSection() {
  const [activeId, setActiveId] = useState(CASE_STUDIES[0].id);
  const active =
    CASE_STUDIES.find((cs) => cs.id === activeId) ?? CASE_STUDIES[0];

  return (
    <section className="w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-black/60 uppercase md:text-lg">
          HOW SWIFT AGENTS CAN HELP YOUR BUSINESS
        </p>
        <h2 className="font-greed-narrow mb-10 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase sm:text-5xl md:mb-6 md:text-[56px] lg:text-[66px]">
          CASE STUDIES
        </h2>

        <div className="mb-10 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:mb-14 lg:mb-18 lg:gap-6 [&::-webkit-scrollbar]:hidden">
          {CASE_STUDIES.map((cs) => (
            <button
              key={cs.id}
              onClick={() => setActiveId(cs.id)}
              className={caseStudyChipClass(cs.id === activeId)}
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

        <CaseStudyDetail caseStudy={active} showFullCaseStudyLink />
      </div>
    </section>
  );
}
