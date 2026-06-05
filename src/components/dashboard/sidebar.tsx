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
    <aside className="fixed bottom-3 left-1/2 z-40 flex w-fit max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-[0_12px_32px_rgba(15,23,42,0.16)] backdrop-blur md:static md:inset-auto md:z-auto md:w-30 md:max-w-none md:translate-x-0 md:flex-col md:justify-start md:rounded-none md:bg-transparent md:py-4 md:shadow-none md:backdrop-blur-none">
      <div className="hidden w-full items-center justify-center p-2 md:flex">
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
      <div className="w-fit max-w-full overflow-visible md:w-full md:flex-1 md:overflow-auto md:py-12">
        <nav className="flex items-center justify-center gap-2 px-1 md:flex-col md:gap-4 md:px-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
