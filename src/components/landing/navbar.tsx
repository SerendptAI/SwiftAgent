"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useRef, useState } from "react";

import { useCurrentUser } from "@/hooks/use-auth";
// Nav hrefs are unprefixed, so they go through the locale-aware Link rather
// than next/link, which would drop the visitor out of their locale.
import { Link } from "@/i18n/navigation";
import { cn, getProfileImage } from "@/lib/utils";

import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
  isExternalHref,
  isLandingNavLinkActive,
  LANDING_NAV_LINKS,
} from "./nav-links";
import { NavigationMenu } from "./navigation-menu";

interface NavbarProps {
  className?: string;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ className }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const [hash, setHash] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const { data: user } = useCurrentUser();
    const t = useTranslations("nav");

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
        <header className="fixed top-6 right-0 left-0 z-100 flex w-full justify-center px-6">
          <nav
            ref={ref}
            className={cn(
              "mx-auto flex h-18 w-full max-w-360 items-center justify-between border border-black bg-white px-4 md:top-13 md:grid md:h-20 md:grid-cols-[auto_1fr_auto] md:gap-4 md:px-6",
              className,
            )}
          >
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center">
              <div className="relative h-14 w-14">
                <Image
                  src="/images/newlogo.svg"
                  alt={t("logoAlt")}
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

                  if (link.dropdown) {
                    const isOpen = openDropdown === link.id;

                    return (
                      <div
                        key={link.href}
                        className="relative h-full"
                        onMouseEnter={() => {
                          if (dropdownCloseTimer.current)
                            clearTimeout(dropdownCloseTimer.current);
                          setOpenDropdown(link.id);
                        }}
                        onMouseLeave={() => {
                          dropdownCloseTimer.current = setTimeout(
                            () => setOpenDropdown(null),
                            350,
                          );
                        }}
                      >
                        <Link
                          href={link.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "font-dm-mono flex h-full items-center gap-1.5 text-sm tracking-[0.2em] text-black uppercase transition-opacity hover:opacity-60",
                            isActive
                              ? "font-medium hover:opacity-100"
                              : "font-normal",
                          )}
                        >
                          {t(`links.${link.id}`)}
                          <Icons.NavChevronDown />
                        </Link>

                        {/* Dropdown panel */}
                        <div
                          className={cn(
                            "absolute top-13.5 -left-6.5 z-50 w-78.5 border border-black bg-white px-6 pt-2 pb-9 transition-all duration-200",
                            isOpen
                              ? "pointer-events-auto translate-y-0 opacity-100"
                              : "pointer-events-none -translate-y-1 opacity-0",
                          )}
                        >
                          {/* Panel header */}
                          <div className="mb-4 flex items-center justify-between">
                            <span className="font-greed-narrow text-[30px] leading-[1.34] font-medium tracking-[-2%] uppercase">
                              {t(`dropdowns.${link.id}.title`)}
                            </span>
                            <Icons.NavChevronDown className="size-5.5" />
                          </div>

                          {/* Preview image */}
                          {link.dropdown.previewImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={link.dropdown.previewImage}
                              alt={t("productPreviewAlt")}
                              className="mb-6 h-25 w-full object-cover"
                              style={{ aspectRatio: "265 / 100" }}
                            />
                          )}

                          {/* Links */}
                          <div className="flex flex-col gap-4">
                            {link.dropdown.links.map((item) => {
                              const isExternal = isExternalHref(item.href);
                              return (
                                <Link
                                  key={item.href + item.id}
                                  href={item.href}
                                  target={isExternal ? "_blank" : undefined}
                                  rel={
                                    isExternal
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className="font-dm-mono text-base leading-[1.83] tracking-[10%] text-black/80 uppercase hover:text-black"
                                >
                                  {t(`dropdowns.${link.id}.links.${item.id}`)}
                                  {item.arrow && (
                                    <Icons.ArrowUpRight className="ml-3 inline-block size-5.5" />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  }

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
                      {t(`links.${link.id}`)}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile hamburger / close toggle */}
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="font-dm-mono relative flex h-[22px] w-[22px] cursor-pointer items-center justify-center text-gray-900 transition-opacity hover:opacity-70 md:hidden"
                aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
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
                  href="/dashboard"
                  aria-label={t("goToDashboard")}
                  className="font-dm-mono hidden max-w-[180px] items-center justify-center gap-2 rounded-lg border border-black bg-white py-1 pr-3 pl-1 text-xs font-medium tracking-[0.1em] text-black uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-black hover:text-white md:flex"
                >
                  <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-black/10">
                    <Image
                      src={user?.picture || getProfileImage(user?.id)}
                      alt={user?.name || t("profileAlt")}
                      fill
                      className="object-cover"
                    />
                  </span>
                  <span className="max-w-[90px] truncate">
                    {user?.name || t("dashboard")}
                  </span>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  className="hidden max-w-[220px] md:flex"
                  asChild
                >
                  <Link href="/login">{t("login")}</Link>
                </Button>
              )}
            </div>
          </nav>
        </header>

        <NavigationMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      </>
    );
  },
);

Navbar.displayName = "Navbar";
