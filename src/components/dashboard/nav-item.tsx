"use client";

import { type LucideIcon } from "lucide-react";
import { createElement } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-muted flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
        isActive
          ? "bg-muted text-primary"
          : "text-muted-foreground hover:text-primary",
      )}
      title={label}
    >
      {createElement(icon, { className: "h-5 w-5" })}
      <span className="sr-only">{label}</span>
    </Link>
  );
}
