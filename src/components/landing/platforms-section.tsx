"use client";

import { useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useInViewAutoplay } from "@/hooks/use-in-view-autoplay";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  {
    id: "website",
    label: "WEBSITE",
    icon: Icons.PlatformWebsite,
    description:
      "Integrate our intelligent chatbot into your website to manage visitor interactions. Any inquiries that the bot cannot resolve will be escalated to a human agent for assistance.",
    video: "/videos/platforms/website.mp4",
  },
  {
    id: "webapp",
    label: "WEB-APP",
    icon: Icons.PlatformWebApp,
    description:
      "Integrate our intelligent chatbot into your web application to manage visitor interactions.",
    video: "/videos/platforms/web-app.mp4",
  },
  {
    id: "mobile",
    label: "MOBILE APP",
    icon: Icons.PlatformMobile,
    description:
      "Integrate our intelligent chatbot into your apps using our SDK",
    video: "/videos/platforms/mobile-app.mp4",
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
                {p.label}
              </button>

              {/* Expanded content — accordion with smooth height animation */}
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  active === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-4 pt-4 pb-3">
                    <p className="font-stolzl px-3 text-base leading-relaxed text-black">
                      {p.description}
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
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <p className="font-stolzl mb-8 max-w-235 text-center text-sm leading-relaxed md:mb-12 md:text-base">
            {PLATFORMS[active].description}
          </p>

          <div className="mb-10 flex max-w-107.5 flex-wrap justify-center gap-4 md:grid md:grid-cols-2 md:gap-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">BOOK A DEMO</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/signup">GET STARTED</Link>
            </Button>
          </div>

          <div className="relative w-full overflow-hidden">
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
