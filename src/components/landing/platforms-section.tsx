"use client";

import { useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  {
    id: "website",
    label: "WEBSITE",
    icon: Icons.PlatformWebsite,
    description:
      "Integrate our intelligent chatbot into your website to manage visitor interactions. Any inquiries that the bot cannot resolve will be escalated to a human agent for assistance.",
    image: "/images/platforms/website.png",
  },
  {
    id: "webapp",
    label: "WEB-APP",
    icon: Icons.PlatformWebApp,
    description:
      "Integrate our intelligent chatbot into your web application to manage visitor interactions.",
    image: "/images/platforms/webapp.png",
  },
  {
    id: "mobile",
    label: "MOBILE APP",
    icon: Icons.PlatformMobile,
    description:
      "Integrate our intelligent chatbot into your apps using our SDK",
    image: "/images/platforms/mobile.png",
  },
];

export function PlatformsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16">
      <div className="mx-auto flex max-w-360 flex-col items-center">
        {/* Tab switcher */}
        <div className="scrollbar-none mb-8 w-full overflow-x-auto md:mb-14 md:w-auto">
          <div className="inline-flex min-w-full items-center bg-[#D9D9D9] p-1.5 md:min-w-0">
            {PLATFORMS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className={cn(
                  "font-dm-mono flex flex-1 cursor-pointer items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-colors duration-150 sm:text-base md:flex-none md:text-lg",
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

        {/* Description */}
        <p className="font-stolzl mb-8 max-w-235 text-center text-sm leading-relaxed md:mb-12 md:text-base">
          {PLATFORMS[active].description}
        </p>

        {/* CTAs */}
        <div className="mb-10 flex max-w-[430px] flex-wrap justify-center gap-4 md:grid md:grid-cols-2 md:gap-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">BOOK A DEMO</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/signup">GET STARTED</Link>
          </Button>
        </div>

        {/* Platform screenshot */}
        <div className="relative w-full overflow-hidden">
          {PLATFORMS.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.id}
              src={p.image}
              alt={`${p.label} preview`}
              className={cn(
                "w-full object-cover transition-opacity duration-300",
                active === i ? "opacity-100" : "absolute inset-0 opacity-0",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
