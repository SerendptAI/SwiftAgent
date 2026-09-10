"use client";

import gsap from "gsap";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useRef } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { Navbar } from "../navbar";

/**
 * The cluster is only 46% of the container wide and the badges size to their
 * own label, so a badge placed by `left-%` runs out of the section — which is
 * `overflow-hidden`, so the label is clipped rather than bled. English is the
 * only language short enough to fit; the right-most badge is therefore
 * anchored to the cluster's right edge and grows leftwards instead.
 */
const REFERRERS = [
  {
    name: "Marcus K.",
    src: "/images/affiliate/avatar-brown.png",
    color: "#6433cc",
    avatar: "left-[40%] top-[4%]",
    badge: "left-[25%] top-[19%]",
  },
  {
    name: "Teo B.",
    src: "/images/affiliate/avatar-yellow.png",
    color: "#6433cc",
    avatar: "left-[42%] top-[40%]",
    badge: "right-0 top-[40%]",
  },
  {
    name: "Ayden P.",
    src: "/images/affiliate/avatar-orange.png",
    color: "#f2b035",
    avatar: "left-[12%] top-[65%]",
    badge: "left-[1%] top-[68%]",
  },
];

function ReferrerBadge({
  name,
  color,
  className,
}: {
  name: string;
  color: string;
  className?: string;
}) {
  const t = useTranslations("affiliate.hero");

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-2xl border border-black bg-white p-4 drop-shadow-[-3px_4px_0px_#000]",
        className,
      )}
    >
      <span className="font-dm-mono text-sm whitespace-nowrap text-[#1f1f1f] uppercase">
        {t("proReferrer")}
      </span>
      <span
        className="font-stolzl text-base font-bold whitespace-nowrap xl:text-lg"
        style={{ color }}
      >
        {name}
      </span>
    </div>
  );
}

function ReferrerAvatar({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-full">
      <Image src={src} alt={name} fill sizes="260px" className="object-cover" />
    </div>
  );
}

export function AffiliateHeroSection() {
  const t = useTranslations("affiliate.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        clearProps: "all",
      });

      if (headlineRef.current) {
        gsap.from(headlineRef.current.children, {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.4,
          clearProps: "all",
        });
      }

      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.9,
        clearProps: "all",
      });

      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          delay: 1,
          clearProps: "all",
        });
      }

      if (clusterRef.current) {
        gsap.from(clusterRef.current.children, {
          scale: 0.85,
          opacity: 0,
          transformOrigin: "center",
          stagger: 0.12,
          duration: 0.7,
          ease: "back.out(1.5)",
          delay: 0.7,
          clearProps: "all",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white">
      <Navbar ref={navRef} />

      <div className="relative mx-auto max-w-360 px-6 md:px-10 lg:px-20 xl:min-h-[900px]">
        <div className="pt-32 pb-16 md:pt-40 lg:pt-48 lg:pb-20 xl:max-w-[58%] xl:pt-56 xl:pb-24">
          <h1
            ref={headlineRef}
            className="font-greed-narrow max-w-[720px] text-[40px] leading-[1.15] font-medium tracking-[-0.02em] text-[#1f1f1f] uppercase sm:text-[52px] lg:text-[64px] xl:text-[72px]"
          >
            <span className="block whitespace-pre-line">
              {t("headline")}
              <span className="text-[#F2B035]">.</span>
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="font-stolzl mt-8 max-w-[633px] text-base leading-[1.6] text-[#7e7e7e] md:text-lg"
          >
            {t("body")}
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap gap-5">
            <Link
              href="/refer"
              className="font-dm-mono inline-flex w-full items-center justify-center rounded-lg border border-black bg-[#F2B035] px-9 py-[18px] text-sm tracking-[0.1em] text-[#1f1f1f] uppercase shadow-[-4px_5px_0px_0px_#000000] transition-all hover:translate-x-[-1px] hover:translate-y-[1px] hover:shadow-[-3px_4px_0px_0px_#000000] sm:w-auto md:text-[18px]"
            >
              {t("submitReferral")}
            </Link>
            <Link
              href="/#pricing"
              className="font-dm-mono inline-flex w-full items-center justify-center rounded-lg border border-black bg-white px-9 py-[18px] text-sm tracking-[0.1em] text-[#1f1f1f] uppercase shadow-[-4px_5px_0px_0px_#000000] transition-all hover:translate-x-[-1px] hover:translate-y-[1px] hover:shadow-[-3px_4px_0px_0px_#000000] sm:w-auto md:text-[18px]"
            >
              {t("viewPlanMetrics")}
            </Link>
          </div>
        </div>

        {/* Avatar cluster (xl+, where the artistic percentage-based layout has room to breathe) */}
        <div
          ref={clusterRef}
          className="absolute top-0 right-0 hidden h-full w-[46%] xl:block"
        >
          {REFERRERS.map((r) => (
            <Fragment key={r.name}>
              <div className={cn("absolute w-[38%]", r.avatar)}>
                <ReferrerAvatar src={r.src} name={r.name} />
              </div>
              <ReferrerBadge
                name={r.name}
                color={r.color}
                className={cn("absolute z-10", r.badge)}
              />
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-360 flex-wrap justify-center gap-8 px-6 pb-16 md:px-10 xl:hidden">
        {REFERRERS.map((r) => (
          <div key={r.name} className="flex w-28 flex-col items-center gap-3">
            <ReferrerAvatar src={r.src} name={r.name} />
            <ReferrerBadge
              name={r.name}
              color={r.color}
              className="items-center"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
