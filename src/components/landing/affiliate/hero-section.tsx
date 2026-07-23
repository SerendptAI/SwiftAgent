import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { Navbar } from "../navbar";

const REFERRERS = [
  {
    name: "Marcus K.",
    src: "/images/affiliate/avatar-brown.png",
    wrap: "top-0 right-[8%] w-[44%]",
    badge: "-bottom-3 left-[6%]",
  },
  {
    name: "Teo B.",
    src: "/images/affiliate/avatar-yellow.png",
    wrap: "top-[34%] right-0 w-[44%]",
    badge: "top-6 -right-6",
  },
  {
    name: "Ayden P.",
    src: "/images/affiliate/avatar-orange.png",
    wrap: "bottom-0 left-[2%] w-[44%]",
    badge: "top-8 -left-6",
  },
];

function ReferrerBadge({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-black/10 bg-white px-3 py-1.5 shadow-[-3px_4px_0px_0px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <span className="font-dm-mono text-[9px] tracking-[0.18em] text-[#7e7e7e] uppercase">
        Pro referrer
      </span>
      <span className="font-stolzl text-sm font-semibold text-[#1f1f1f]">
        {name}
      </span>
    </div>
  );
}

function ReferrerAvatar({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        className,
      )}
    >
      <Image src={src} alt={name} fill sizes="240px" className="object-cover" />
    </div>
  );
}

export function AffiliateHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <Navbar />

      <div className="mx-auto flex w-full max-w-360 flex-col gap-12 px-6 pt-32 pb-16 md:px-10 md:pt-40 lg:flex-row lg:items-center lg:gap-8 lg:px-20 lg:pt-48 lg:pb-24">
        {/* Left — copy + CTAs */}
        <div className="flex w-full flex-col lg:w-[52%]">
          <h1 className="font-greed-narrow text-[40px] leading-[1.1] font-medium tracking-[-0.02em] text-[#1f1f1f] uppercase sm:text-[52px] lg:text-[60px] xl:text-[72px]">
            You already know the businesses we&apos;re looking for
            <span className="text-[#F2B035]">.</span>
          </h1>

          <p className="font-stolzl mt-6 max-w-[600px] text-base leading-[1.6] text-[#7e7e7e] md:mt-8 md:text-lg">
            SwiftAgents empowers websites with smart AI assistants that handle
            live chats, ticketing, and support flows seamlessly. Introduce us to
            businesses struggling with manual support, and get paid when they go
            live. It&apos;s that simple.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 md:mt-10 md:gap-5">
            <Link
              href="/refer"
              className="font-dm-mono inline-flex items-center justify-center rounded-lg border border-black bg-[#F2B035] px-9 py-[18px] text-sm tracking-[0.12em] text-[#1f1f1f] uppercase shadow-[-4px_5px_0px_0px_#000000] transition-all hover:translate-x-[-1px] hover:translate-y-[1px] hover:shadow-[-3px_4px_0px_0px_#000000] md:text-[18px]"
            >
              Submit referral
            </Link>
            <Link
              href="/#pricing"
              className="font-dm-mono inline-flex items-center justify-center rounded-lg border border-black bg-white px-9 py-[18px] text-sm tracking-[0.12em] text-[#1f1f1f] uppercase shadow-[-4px_5px_0px_0px_#000000] transition-all hover:translate-x-[-1px] hover:translate-y-[1px] hover:shadow-[-3px_4px_0px_0px_#000000] md:text-[18px]"
            >
              View plan metrics
            </Link>
          </div>
        </div>

        {/* Right — avatar cluster (lg) */}
        <div className="hidden lg:block lg:w-[48%]">
          <div className="relative mx-auto aspect-square w-full max-w-[540px]">
            {REFERRERS.map((r) => (
              <div key={r.name} className={cn("absolute", r.wrap)}>
                <ReferrerAvatar src={r.src} name={r.name} />
                <ReferrerBadge
                  name={r.name}
                  className={cn("absolute z-10", r.badge)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Avatar row (mobile / tablet) */}
        <div className="flex flex-wrap justify-center gap-6 lg:hidden">
          {REFERRERS.map((r) => (
            <div key={r.name} className="flex w-24 flex-col items-center gap-2">
              <ReferrerAvatar src={r.src} name={r.name} />
              <ReferrerBadge
                name={r.name}
                className="items-center text-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
