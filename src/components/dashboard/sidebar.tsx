"use client";

import { Invoice01Icon, Settings01Icon, Ticket02Icon } from "hugeicons-react";
import Image from "next/image";

import { NavItem } from "@/components/dashboard/nav-item";
import { Icons } from "@/components/icons";
import { HugeiconsIcon } from "@/components/ui/hugeicons-icon";
import { useTickets } from "@/hooks/use-tickets";

export function Sidebar() {
  const { data: tickets } = useTickets();
  const pendingTicketsCount = tickets?.length ?? 0;

  const navItems = [
    {
      href: "/dashboard",
      icon: (props: { className?: string }) => <Icons.Document {...props} />,
      activeIcon: (props: { className?: string }) => (
        <Icons.DocumentBold {...props} />
      ),
      label: "Dashboard",
    },
    {
      href: "/dashboard/ticketing",
      icon: (props: { className?: string }) => (
        <HugeiconsIcon icon={Ticket02Icon} {...props} />
      ),
      label: "Ticketing",
      badgeCount: pendingTicketsCount,
    },
    {
      href: "/dashboard/billing",
      icon: (props: { className?: string }) => (
        <HugeiconsIcon icon={Invoice01Icon} {...props} />
      ),
      label: "Billing",
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
        <div className="flex h-16 w-16 items-center justify-center bg-[#F2B035] transition-none">
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
        <nav className="flex flex-col items-center gap-4 px-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
