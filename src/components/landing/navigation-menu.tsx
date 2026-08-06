"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCurrentUser } from "@/hooks/use-auth";
import { cn, getProfileImage } from "@/lib/utils";

import { Icons } from "../icons";
import {
  isExternalHref,
  isLandingNavLinkActive,
  LANDING_NAV_LINKS,
} from "./nav-links";

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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
      gsap.set(overlayRef.current, { display: "block" });
      gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.fromTo(
        containerRef.current,
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.4, ease: "power3.out" },
      );

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
        className="absolute top-22.5 right-0 left-0 overflow-hidden px-6"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="mx-auto w-full max-w-360 border-r border-b border-l border-black bg-white pt-8">
          <div ref={linksRef} className="flex flex-col">
            {LANDING_NAV_LINKS.map((link) => {
              const isActive = isLandingNavLinkActive(
                link.href,
                pathname,
                hash,
              );

              if (link.dropdown) {
                const isOpen = openDropdown === link.label;

                return (
                  <div key={link.href} className="m-4">
                    {/* Accordion trigger */}
                    <button
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : link.label)
                      }
                      className={cn(
                        "font-dm-mono flex w-full items-center justify-between px-6 py-3 text-base font-normal tracking-[0.2em] text-gray-900 uppercase transition-colors hover:bg-gray-50",
                        isActive &&
                          "border border-black bg-gray-50 font-medium",
                      )}
                    >
                      {link.label}
                      <span
                        className={cn(
                          "transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      >
                        <Icons.NavChevronDown />
                      </span>
                    </button>

                    {/* Accordion content */}
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-5 border border-t-0 border-black px-6 py-5">
                          {link.dropdown.previewImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={link.dropdown.previewImage}
                              alt="Swift Agents product preview"
                              className="w-full object-cover"
                              style={{ aspectRatio: "265 / 100" }}
                            />
                          )}
                          <div className="flex flex-col gap-4">
                            {link.dropdown.links.map((item) => {
                              const isExternal = isExternalHref(item.href);
                              return (
                                <Link
                                  key={item.href + item.label}
                                  href={item.href}
                                  onClick={onClose}
                                  target={isExternal ? "_blank" : undefined}
                                  rel={
                                    isExternal
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className="font-dm-mono flex items-center gap-2 text-sm tracking-[0.12em] text-black uppercase hover:opacity-60"
                                >
                                  {item.label}
                                  {item.arrow && (
                                    <Icons.ArrowUpRight
                                      width={16}
                                      height={16}
                                    />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

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
    </div>
  );
}
