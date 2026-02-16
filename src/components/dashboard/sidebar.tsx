"use client";

import {
  DashboardSquare01Icon,
  Invoice01Icon,
  Settings01Icon,
  Ticket02Icon,
} from "hugeicons-react";
import Image from "next/image";

import { NavItem } from "@/components/dashboard/nav-item";
import { HugeiconsIcon } from "@/components/ui/hugeicons-icon";

export function Sidebar() {
  const navItems = [
    {
      href: "/dashboard",
      icon: (props: { className?: string }) => (
        <HugeiconsIcon icon={DashboardSquare01Icon} {...props} />
      ),
      label: "Dashboard",
    },

    {
      href: "/dashboard/identity",
      icon: (props: { className?: string }) => (
        <HugeiconsIcon icon={Ticket02Icon} {...props} />
      ),
      label: "Company Identity",
    },
    {
      href: "/dashboard/knowledge",
      icon: (props: { className?: string }) => (
        <HugeiconsIcon icon={Invoice01Icon} {...props} />
      ),
      label: "Knowledge Sources",
    },
    {
      href: "/dashboard/settings",
      icon: (props: { className?: string }) => (
        <HugeiconsIcon icon={Settings01Icon} {...props} />
      ),
      label: "Settings",
    },
  ];

  return (
    <aside className="hidden w-30 flex-col py-4 md:flex">
      <div className="flex w-full items-center justify-center p-2">
        <div className="flex h-16 w-16 items-center justify-center bg-black transition-none">
          <div className="relative h-8 w-8">
            <Image
              src="/images/mask.svg"
              alt="Loading..."
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-12">
        <nav className="flex flex-col items-center gap-8 px-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
