"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCurrentUser } from "@/hooks/use-auth";
import { cn, getProfileImage } from "@/lib/utils";

import { isLandingNavLinkActive, LANDING_NAV_LINKS } from "./nav-links";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [hash, setHash] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  const isLoggedIn = isMounted && !!user;

  useEffect(() => {
    setIsMounted(true);
    const updateHash = () => setHash(window.location.hash);

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    if (!overlayRef.current || !containerRef.current || !linksRef.current)
      return;

    if (isOpen) {
      // Show the overlay
      gsap.set(overlayRef.current, { display: "block" });
      gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Slide the menu down
      gsap.fromTo(
        containerRef.current,
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.4, ease: "power3.out" },
      );

      // Stagger links in
      gsap.fromTo(
        linksRef.current.children,
        { y: -15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.06,
          delay: 0.15,
          ease: "power2.out",
        },
      );
    } else {
      // Slide the menu up
      gsap.to(containerRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      });

      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        delay: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99] hidden"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={containerRef}
        className="absolute top-[90px] right-0 left-0 mx-auto w-[92%] overflow-hidden border-r border-b border-l border-black bg-white pt-8"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        <div ref={linksRef} className="flex flex-col">
          {LANDING_NAV_LINKS.map((link) => {
            const isActive = isLandingNavLinkActive(link.href, pathname, hash);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "font-dm-mono m-4 px-6 py-3 text-base font-normal tracking-[0.2em] text-gray-900 uppercase transition-colors hover:bg-gray-50",
                  isActive && "border border-black bg-gray-50 font-medium",
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Login / profile button inside menu */}
          <div className="p-4">
            {isLoggedIn ? (
              <Link
                href="/en/dashboard"
                onClick={onClose}
                className="font-dm-mono flex w-full items-center justify-center gap-3 rounded-lg border bg-[#F2B035] px-8 py-3 text-base font-normal tracking-[0.15em] text-black uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-gray-800"
              >
                <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-black/10">
                  <Image
                    src={user?.picture || getProfileImage(user?.id)}
                    alt={user?.name || "Profile"}
                    fill
                    className="object-cover"
                  />
                </span>
                <span className="max-w-[160px] truncate">
                  {user?.name || "Dashboard"}
                </span>
              </Link>
            ) : (
              <Link
                href="/en/login"
                onClick={onClose}
                className="font-dm-mono flex w-full items-center justify-center rounded-lg border bg-[#F2B035] px-8 py-3 text-base font-normal tracking-[0.15em] text-black uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-gray-800"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
