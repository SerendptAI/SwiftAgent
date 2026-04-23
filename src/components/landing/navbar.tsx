"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef, useState } from "react";

import { Icons } from "../icons";
import { NavigationMenu } from "./navigation-menu";

interface NavbarProps {
  className?: string;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ className }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <>
        <nav
          ref={ref}
          className={
            className ??
            "fixed top-[30px] right-0 left-0 z-50 mx-auto flex h-[70px] w-[92%] items-center justify-between border border-black bg-white px-4 md:top-[52px] md:grid md:h-[80px] md:w-[90%] md:grid-cols-[auto_1fr_auto] md:gap-4 md:px-8"
          }
        >
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <div className="relative h-14 w-14">
              <Image
                src="/images/newlogo.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Right Section — Nav Links + Login */}
          <div className="flex h-full items-center justify-end gap-10 lg:gap-14">
            {/* Desktop nav links */}
            <div className="hidden items-center gap-8 md:flex lg:gap-10">
              <Link
                href="/"
                className="font-dm-mono text-base tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-60"
              >
                HOME
              </Link>
              <Link
                href="/#how-it-works"
                className="font-dm-mono text-base tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-60"
              >
                ABOUT
              </Link>
              <Link
                href="/#talk"
                className="font-dm-mono text-base tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-60"
              >
                TYPES OF AGENTS
              </Link>
              <Link
                href="/#pricing"
                className="font-dm-mono text-base tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-60"
              >
                BILLING
              </Link>
            </div>

            {/* Mobile hamburger / close toggle */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="font-dm-mono relative flex h-[22px] w-[22px] cursor-pointer items-center justify-center text-gray-900 transition-opacity hover:opacity-70 md:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {/* Hamburger lines — visible when closed */}
              <div
                className="absolute flex flex-col gap-[5px] transition-all duration-300"
                style={{
                  opacity: isMenuOpen ? 0 : 1,
                  transform: isMenuOpen
                    ? "rotate(45deg) scale(0.5)"
                    : "rotate(0) scale(1)",
                }}
              >
                <Icons.MenuOpen />
              </div>
              {/* Plus/X icon — visible when open */}
              <span
                className="font-dm-mono absolute text-2xl leading-none font-light transition-all duration-300"
                style={{
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen
                    ? "rotate(90deg) scale(1)"
                    : "rotate(0) scale(0.5)",
                }}
              >
                <Icons.Cross />
              </span>
            </button>
            <Link
              href="/en/login"
              className="font-dm-mono hidden items-center justify-center rounded-lg border border-gray-900 bg-white px-8 py-3 text-xs font-bold tracking-[0.15em] text-gray-900 uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-gray-900 hover:text-white md:flex"
            >
              LOGIN/SIGN UP
            </Link>
          </div>
        </nav>

        <NavigationMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      </>
    );
  },
);

Navbar.displayName = "Navbar";
