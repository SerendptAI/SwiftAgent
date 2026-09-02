"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useInViewAutoplay } from "@/hooks/use-in-view-autoplay";
import { Link } from "@/i18n/navigation";
import { videoUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

import { DemoBookingLink } from "./demo-booking-link";

/** Copy lives in the `common.platforms` catalogue, keyed by id. */
const PLATFORMS = [
  {
    id: "website",
    icon: Icons.PlatformWebsite,
    video: videoUrl("platforms/website"),
  },
  {
    id: "webapp",
    icon: Icons.PlatformWebApp,
    video: videoUrl("platforms/web-app"),
  },
  {
    id: "mobile",
    icon: Icons.PlatformMobile,
    video: videoUrl("platforms/mobile-app"),
  },
];

function PlatformVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useInViewAutoplay();

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="none"
      className={cn("h-auto w-full object-cover object-center", className)}
    />
  );
}

export function PlatformsSection() {
  const t = useTranslations("common");
  const tc = useTranslations("common.cta");
  const [active, setActive] = useState(0);

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16">
      <div className="mx-auto max-w-360">
        <div className="flex flex-col gap-4 bg-[#D9D9D9] px-3 py-4 md:hidden">
          {PLATFORMS.map((p, i) => (
            <div key={p.id}>
              <button
                onClick={() => setActive(i)}
                className={cn(
                  "font-dm-mono flex w-full items-center justify-center gap-2 px-5 py-4 text-base font-medium tracking-[0.12em] uppercase transition-colors duration-150",
                  "bg-white text-black",
                )}
              >
                {p.icon}
                {t(`platforms.${p.id}.label`)}
              </button>

              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  active === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-4 pt-4 pb-3">
                    <p className="font-stolzl px-3 text-base leading-relaxed text-black">
                      {t(`platforms.${p.id}.description`)}
                    </p>
                    <PlatformVideo
                      src={p.video}
                      className={cn("h-86", {
                        "object-bottom-right": i < 2,
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden flex-col items-center md:flex">
          <div className="scrollbar-none mb-14 w-auto overflow-x-auto">
            <div className="inline-flex min-w-0 items-center bg-[#D9D9D9] p-1.5">
              {PLATFORMS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    "font-dm-mono flex cursor-pointer items-center justify-center gap-2 px-5 py-2.5 text-lg font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-colors duration-150",
                    active === i
                      ? "bg-white text-black"
                      : "text-black/70 hover:text-black",
                  )}
                >
                  {p.icon}
                  {t(`platforms.${p.id}.label`)}
                </button>
              ))}
            </div>
          </div>

          <p className="font-stolzl mb-8 max-w-235 text-center text-sm leading-relaxed md:mb-12 md:text-base">
            {t(`platforms.${PLATFORMS[active].id}.description`)}
          </p>

          <div className="mb-10 flex max-w-107.5 flex-wrap justify-center gap-4 md:grid md:grid-cols-2 md:gap-8">
            <Button
              variant="outline"
              size="lg"
              className="px-4 text-center leading-tight whitespace-normal"
              asChild
            >
              <DemoBookingLink location="landing-platforms">
                {tc("bookDemo")}
              </DemoBookingLink>
            </Button>
            <Button
              size="lg"
              className="px-4 text-center leading-tight whitespace-normal"
              asChild
            >
              <Link href="/signup">{tc("getStarted")}</Link>
            </Button>
          </div>
          <div className="relative w-full">
            {PLATFORMS.map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  "w-full transition-opacity duration-300",
                  active === i ? "opacity-100" : "absolute inset-0 opacity-0",
                )}
              >
                <PlatformVideo src={p.video} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
