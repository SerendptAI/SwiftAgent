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
        "hover:bg-muted flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
        isActive
          ? "bg-muted text-primary"
          : "text-muted-foreground hover:text-primary",
      )}
      title={label}
    >
      {createElement(icon, { className: "h-6 w-6" })}
      <span className="sr-only">{label}</span>
    </Link>
  );
}
