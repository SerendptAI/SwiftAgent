"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const AUTH_MENU_LINKS = [
  { id: "login", href: "/login", Icon: Icons.AuthLogin },
  { id: "signup", href: "/signup", Icon: Icons.AuthSignUp },
] as const;

interface AuthMenuProps {
  className?: string;
}

/**
 * The logged-out account control: one amber button that opens a two-entry menu.
 * It mirrors the LocaleSwitcher's dropdown mechanics rather than the hover-open
 * nav-link dropdowns, because it sits beside the switcher and a destination as
 * consequential as sign-up should not open on a passing cursor.
 */
export function AuthMenu({ className }: AuthMenuProps) {
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        // 236px is the design width, which fits the English label. Longer
        // translations grow the button rather than spilling out of it.
        className="font-dm-mono flex h-12 min-w-59 cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-[#F2B035] px-5 text-base font-medium tracking-[0.15em] whitespace-nowrap text-[#1f1f1f] uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:brightness-95"
      >
        {t("loginSignUp")}
        <Icons.NavChevronDown
          className={cn("size-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      <div
        role="menu"
        className={cn(
          "absolute top-14 right-0 z-50 w-full border border-black bg-white p-[7px] transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {AUTH_MENU_LINKS.map(({ id, href, Icon }) => (
          <Link
            key={id}
            href={href}
            role="menuitem"
            // The menu stays mounted so it can transition, so its links are
            // pulled out of the tab order while it is hidden.
            tabIndex={isOpen ? undefined : -1}
            onClick={() => setIsOpen(false)}
            className="font-dm-mono flex h-9.5 items-center gap-[44px] rounded-lg pl-[13px] text-base tracking-[0.1em] text-black uppercase transition-colors hover:bg-[#F2B035]/45 focus-visible:bg-[#F2B035]/45 focus-visible:outline-none"
          >
            <Icon className="size-6 shrink-0" />
            {t(id)}
          </Link>
        ))}
      </div>
    </div>
  );
}
