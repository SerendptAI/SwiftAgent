"use client";

import { createElement } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  activeIcon?: React.ElementType;
  label: string;
  activeColor?: string;
  iconClassName?: string;
}

export function NavItem({
  href,
  icon,
  activeIcon,
  label,
  activeColor,
  iconClassName = "h-7 w-7",
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "bg-muted relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200",
        isActive ? "" : "text-muted-foreground hover:bg-muted",
      )}
      style={
        isActive
          ? activeColor
            ? {
                backgroundColor: `${activeColor}`,
                boxShadow: `0 0 0 1.5px ${activeColor}40`,
                color: "white",
              }
            : {
                backgroundColor: "#EDEDED",
              }
          : undefined
      }
      title={label}
    >
      {isActive && activeColor && (
        <span
          className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
          style={{ backgroundColor: activeColor }}
        />
      )}
      {createElement(isActive && activeIcon ? activeIcon : icon, {
        className: `${iconClassName} ${!isActive ? "opacity-50" : "opacity-100"} transition-opacity duration-200`,
        style: {
          color: isActive && activeColor && !activeIcon ? "white" : undefined,
        },
      })}
      <span className="sr-only">{label}</span>
    </Link>
  );
}
