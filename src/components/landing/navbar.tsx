"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useRef, useState } from "react";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { useCurrentUser } from "@/hooks/use-auth";
// Nav hrefs are unprefixed, so they go through the locale-aware Link rather
// than next/link, which would drop the visitor out of their locale.
import { Link } from "@/i18n/navigation";
import { cn, getProfileImage } from "@/lib/utils";

import { Icons } from "../icons";
import { AuthMenu } from "./auth-menu";
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
            <Link href="/" className="flex shrink-0 items-center">
              <div className="relative h-11 w-11 sm:h-14 sm:w-14">
                <Image
                  src="/images/newlogo.svg"
                  alt={t("logoAlt")}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/*
              The full link row only appears from xl up. English is the only
              language whose seven labels fit in less: "Parrainage" and
              "Rasilimali" are roughly double "Earn", and with the locale
              switcher and the account chip the row needs about 1230px in
              fr/sw. Below xl the hamburger menu carries the links instead.

              The gaps tighten in the xl–2xl band for the same reason — at the
              2xl spacing the row overflows its own border in fr/sw.
            */}
            <div className="flex h-full items-center justify-end gap-6 2xl:gap-14">
              <div className="hidden items-center gap-5 xl:flex 2xl:gap-10">
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
                            "flex h-full items-center gap-1.5 text-sm tracking-[10%] whitespace-nowrap text-black transition-opacity hover:opacity-60",
                            isActive
                              ? "font-medium hover:opacity-100"
                              : "font-normal",
                          )}
                        >
                          {t(`links.${link.id}`)}
                          <Icons.NavChevronDown />
                        </Link>

                        <div
                          className={cn(
                            "absolute top-13.5 -left-6.5 z-50 w-89 border border-black bg-white p-6 transition-all duration-200",
                            isOpen
                              ? "pointer-events-auto translate-y-0 opacity-100"
                              : "pointer-events-none -translate-y-1 opacity-0",
                          )}
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <span className="font-press-start text-base leading-normal tracking-[-2%] uppercase">
                              {t(`dropdowns.${link.id}.title`)}
                            </span>
                            <Icons.NavChevronDown className="size-4.5" />
                          </div>

                          {link.dropdown.previewImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={link.dropdown.previewImage}
                              alt={t("productPreviewAlt")}
                              className="mb-4 h-26 w-full object-cover"
                              style={{ aspectRatio: "265 / 100" }}
                            />
                          )}

                          <div className="flex flex-col gap-2">
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
                                  className="text-base leading-[1.83] tracking-[-2%] text-black/80 hover:text-black"
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
                        "text-sm tracking-[10%] whitespace-nowrap text-gray-900 transition-opacity hover:opacity-60",
                        isActive ? "font-medium" : "font-normal",
                      )}
                    >
                      {t(`links.${link.id}`)}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-6 sm:gap-8 lg:gap-5">
                <LocaleSwitcher className="shrink-0" />

                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="relative mr-1.5 flex h-7 w-7 cursor-pointer items-center justify-center text-gray-900 transition-opacity hover:opacity-70 xl:hidden"
                  aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
                >
                  <div
                    className="absolute flex flex-col gap-[5px] transition-all duration-300"
                    style={{
                      opacity: isMenuOpen ? 0 : 1,
                      transform: isMenuOpen
                        ? "rotate(45deg) scale(0.5)"
                        : "rotate(0) scale(0.8)",
                    }}
                  >
                    <Icons.MenuOpen />
                  </div>
                  <span
                    className="absolute transition-all duration-300"
                    style={{
                      opacity: isMenuOpen ? 1 : 0,
                      transform: isMenuOpen
                        ? "rotate(90deg) scale(0.7)"
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
                    // The chip is capped tighter than the login button it
                    // replaces so that signing in cannot widen the row past
                    // what the logged-out layout already fits.
                    className="hidden max-w-[150px] shrink-0 items-center justify-center gap-2 rounded-lg border border-black bg-white py-1 pr-3 pl-1 text-xs font-medium tracking-[10%] text-black shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-black hover:text-white xl:flex"
                  >
                    <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-black/10">
                      <Image
                        src={user?.picture || getProfileImage(user?.id)}
                        alt={user?.name || t("profileAlt")}
                        fill
                        className="object-cover"
                      />
                    </span>
                    <span className="max-w-[70px] truncate">
                      {user?.name || t("dashboard")}
                    </span>
                  </Link>
                ) : (
                  <AuthMenu className="hidden w-fit shrink-0 xl:block" />
                )}
              </div>
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
