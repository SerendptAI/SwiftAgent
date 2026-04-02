"use client";

import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/#how-it-works" },
  { label: "TYPES OF AGENTS", href: "/#talk" },
  { label: "BILLING", href: "/#pricing" },
];

export function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
        className="absolute top-[130px] right-0 left-0 mx-auto w-[92%] overflow-hidden border-r border-b border-l border-black bg-white"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        <div ref={linksRef} className="flex flex-col">
          {MENU_LINKS.map((link, i) => {
            const isActive =
              link.href === "/"
                ? pathname === "/" || pathname === "/en"
                : pathname +
                    (typeof window !== "undefined"
                      ? window.location.hash
                      : "") ===
                  link.href;

            return (
              <Link
                key={i}
                href={link.href}
                onClick={onClose}
                className={`font-dm-mono m-4 px-6 py-4 text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-colors hover:bg-gray-50 ${
                  isActive ? "border border-black bg-gray-50" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Login button inside menu */}
          <div className="p-4">
            <Link
              href="/en/login"
              onClick={onClose}
              className="font-dm-mono flex w-full items-center justify-center rounded-lg border bg-[#F2B035] px-8 py-3 text-xs font-bold tracking-[0.15em] text-black uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-gray-800"
            >
              LOGIN/SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
