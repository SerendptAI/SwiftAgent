"use client";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import { Icons } from "@/components/icons";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * A language is named in its own language whatever the surrounding UI is, so
 * these endonyms are deliberately constants rather than catalogue entries.
 */
const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  sw: "Kiswahili",
};

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Switching locale is a client-side navigation, which does not carry back the
 * middleware `Set-Cookie` that a full document request would. Without writing
 * the cookie here the choice is forgotten the moment the visitor returns to an
 * unprefixed URL, and language negotiation sends them back to their browser's
 * language. `NEXT_LOCALE` is the cookie next-intl's middleware reads.
 */
function rememberLocale(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

interface LocaleSwitcherProps {
  /** `dropdown` for the desktop navbar, `row` for the mobile menu. */
  variant?: "dropdown" | "row";
  className?: string;
  onSwitch?: () => void;
}

export function LocaleSwitcher({
  variant = "dropdown",
  className,
  onSwitch,
}: LocaleSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  // This pathname has the locale segment stripped, so the same page is kept
  // across the switch instead of dropping the visitor on the homepage.
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
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

  function switchTo(next: string) {
    setIsOpen(false);
    onSwitch?.();

    if (next === locale) return;

    rememberLocale(next);
    startTransition(() => router.replace(pathname, { locale: next }));
  }

  if (variant === "row") {
    return (
      <div
        className={cn("flex items-center gap-2", className)}
        role="group"
        aria-label={t("changeLanguage")}
      >
        {routing.locales.map((option) => (
          <button
            key={option}
            onClick={() => switchTo(option)}
            aria-current={option === locale ? "true" : undefined}
            lang={option}
            className={cn(
              "font-dm-mono flex-1 rounded-lg border px-3 py-2 text-sm tracking-[0.15em] uppercase transition-colors",
              option === locale
                ? "border-black bg-black text-white"
                : "border-black/30 text-black hover:border-black",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("changeLanguage")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={isPending}
        className={cn(
          "font-dm-mono flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#BDBDBD]/50 bg-white px-3 text-sm font-medium tracking-[0.15em] text-black uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-black hover:text-white disabled:opacity-50",
        )}
      >
        {locale}
        <Icons.NavChevronDown
          className={cn("size-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      <div
        role="menu"
        className={cn(
          "absolute top-11 right-0 z-50 w-40 border border-black bg-white py-2 transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {routing.locales.map((option) => (
          <button
            key={option}
            role="menuitem"
            onClick={() => switchTo(option)}
            lang={option}
            className={cn(
              "font-dm-mono flex w-full items-center justify-between px-4 py-2 text-left text-sm text-black/80 transition-colors hover:bg-gray-50 hover:text-black",
              option === locale && "font-medium text-black",
            )}
          >
            {LOCALE_NAMES[option] ?? option}
            {option === locale && <Check className="size-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}
