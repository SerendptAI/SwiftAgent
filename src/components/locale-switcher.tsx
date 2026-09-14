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
  className?: string;
  onSwitch?: () => void;
}

export function LocaleSwitcher({ className, onSwitch }: LocaleSwitcherProps) {
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

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("changeLanguage")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={isPending}
        className={cn(
          "flex h-10 cursor-pointer items-center gap-1.5 rounded-md border border-black bg-white px-2.5 text-base font-medium tracking-[10%] text-black uppercase shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-black hover:text-white disabled:opacity-50 sm:rounded-lg md:px-3 md:text-lg",
        )}
      >
        {locale}
        <Icons.NavChevronDown
          className={cn(
            "size-3.5 transition-transform",
            isOpen && "rotate-180",
          )}
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
              "flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-base text-black/70 transition-colors hover:bg-gray-200 hover:text-black",
              {
                "font-medium text-black": option === locale,
              },
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
