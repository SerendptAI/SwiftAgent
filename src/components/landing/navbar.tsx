"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useEffect, useState } from "react";

import { useCurrentUser } from "@/hooks/use-auth";
import { cn, getProfileImage } from "@/lib/utils";

import { Icons } from "../icons";
import { Button } from "../ui/button";
import { isLandingNavLinkActive, LANDING_NAV_LINKS } from "./nav-links";
import { NavigationMenu } from "./navigation-menu";

interface NavbarProps {
  className?: string;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ className }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hash, setHash] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const { data: user } = useCurrentUser();

    // Only trust the auth state after mount to avoid a hydration mismatch
    // (the token lives in localStorage, unavailable during SSR).
    const isLoggedIn = isMounted && !!user;

    useEffect(() => {
      setIsMounted(true);
      const updateHash = () => setHash(window.location.hash);

      updateHash();
      window.addEventListener("hashchange", updateHash);
      return () => window.removeEventListener("hashchange", updateHash);
    }, []);

    return (
      <>
        <nav
          ref={ref}
          className={
            className ??
            "fixed top-[30px] right-0 left-0 z-100 mx-auto flex h-[70px] w-[92%] items-center justify-between border border-black bg-white px-4 md:top-[52px] md:grid md:h-[80px] md:w-[90%] md:grid-cols-[auto_1fr_auto] md:gap-4 md:px-8"
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
              {LANDING_NAV_LINKS.map((link) => {
                const isActive = isLandingNavLinkActive(
                  link.href,
                  pathname,
                  hash,
                );

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "font-dm-mono text-sm tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-60",
                      isActive ? "font-medium" : "font-normal",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
            {isLoggedIn ? (
              <Link
                href="/en/dashboard"
                aria-label="Go to dashboard"
                className="font-dm-mono hidden max-w-[180px] items-center justify-center gap-2 rounded-lg border border-black bg-white py-1 pr-3 pl-1 text-xs font-medium tracking-[0.1em] text-black uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-black hover:text-white md:flex"
              >
                <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-black/10">
                  <Image
                    src={user?.picture || getProfileImage(user?.id)}
                    alt={user?.name || "Profile"}
                    fill
                    className="object-cover"
                  />
                </span>
                <span className="max-w-[90px] truncate">
                  {user?.name || "Dashboard"}
                </span>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="hidden max-w-[220px] md:flex"
                asChild
              >
                <Link href="/en/login">LOGIN</Link>
              </Button>
            )}
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
