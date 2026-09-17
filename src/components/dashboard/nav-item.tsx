"use client";

import { createElement } from "react";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  activeIcon?: React.ElementType;
  label: string;
  activeColor?: string;
  iconClassName?: string;
  className?: string;
  badgeCount?: number;
}

export function NavItem({
  href,
  icon,
  activeIcon,
  label,
  activeColor,
  iconClassName = "h-6 w-6 md:h-7 md:w-7",
  className,
  badgeCount = 0,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <InfoTooltip text={label} side="right">
      <Link
        href={href}
        aria-label={label}
        className={cn(
          "bg-muted relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 md:h-16 md:w-16",
          {
            "text-muted-foreground hover:bg-muted": !isActive,
          },
          className,
        )}
        style={
          isActive
            ? activeColor
              ? {
                  backgroundColor: activeColor,
                  color: "white",
                }
              : {
                  backgroundColor: "#EDEDED",
                }
            : undefined
        }
      >
        {createElement(isActive && activeIcon ? activeIcon : icon, {
          className: `${iconClassName} ${!isActive ? "opacity-50" : "opacity-100"} transition-opacity duration-200`,
          style: {
            color: isActive && activeColor && !activeIcon ? "white" : undefined,
          },
        })}
        {badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
        <span className="sr-only">
          {label}
          {badgeCount > 0 ? ` (${badgeCount} pending)` : ""}
        </span>
      </Link>
    </InfoTooltip>
  );
}
