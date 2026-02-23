"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT SWIFT AGENTS", href: "/#how-it-works" },
  { label: "TALK TO OUR AGENT", href: "/#talk" },
  { label: "BILLING", href: "/#pricing" },
];

const CHECKER_GRID = [
  0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1,
];

export function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const checkerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !overlayRef.current ||
      !containerRef.current ||
      !linksRef.current ||
      !checkerRef.current
    )
      return;

    if (isOpen) {
      gsap.set(overlayRef.current, { display: "block", autoAlpha: 1 });

      // Animate container sliding down or from right
      gsap.fromTo(
        containerRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.8, ease: "power4.inOut" },
      );

      gsap.fromTo(
        linksRef.current.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        checkerRef.current.querySelectorAll(".checker-block"),
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: { each: 0.03, from: "random" },
          delay: 0.5,
          ease: "back.out(1.5)",
        },
      );
    } else {
      gsap.to(containerRef.current, {
        x: "100%",
        duration: 0.6,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" });
        },
      });

      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 hidden bg-black/20 backdrop-blur-sm"
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
        className="absolute top-0 right-0 flex h-full w-full bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Left Content */}
        <div className="relative z-10 flex w-full flex-1 flex-col px-12 pt-12 md:w-3/5 md:px-24 md:pt-24 xl:px-32">
          <div className="mb-16 flex w-full items-center justify-end md:hidden lg:mb-32">
            <button
              onClick={onClose}
              className="font-mono text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-colors hover:text-[#E8442A]"
            >
              CLOSE MENU
            </button>
          </div>

          <div
            ref={linksRef}
            className="mt-12 flex flex-col gap-10 md:mt-24 md:gap-14"
          >
            {MENU_LINKS.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                onClick={onClose}
                className="font-instrument w-max origin-left text-4xl font-black tracking-tighter text-gray-900 uppercase transition-colors hover:text-[#E8442A] sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Checkerboard & Close Button */}
        <div className="absolute top-0 right-0 hidden h-full w-[45%] flex-col md:flex">
          <div className="absolute top-12 left-12 z-20 md:top-24">
            <button
              onClick={onClose}
              className="font-mono text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-colors hover:text-[#E8442A]"
            >
              CLOSE MENU
            </button>
          </div>

          <div
            ref={checkerRef}
            className="pointer-events-none grid h-full w-full grid-cols-4 grid-rows-6"
          >
            {CHECKER_GRID.map((isOrange, i) => (
              <div
                key={i}
                className={`checker-block h-full w-full ${isOrange ? "bg-[#E8442A]" : "bg-transparent"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
