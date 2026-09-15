"use client";

import Image from "next/image";

import { NavItem } from "@/components/dashboard/nav-item";
import { useTickets } from "@/hooks/use-tickets";

function sidebarIcon(src: string, alt: string) {
  return function SidebarIcon(props: { className?: string }) {
    return (
      <span className={`relative block ${props.className ?? ""}`}>
        <Image src={src} alt={alt} fill className="object-contain" />
      </span>
    );
  };
}

export function Sidebar() {
  const { data: tickets } = useTickets();
  const pendingTicketsCount =
    tickets?.filter((t) => (t.unseen_count ?? 0) > 0).length ?? 0;

  const navItems = [
    {
      href: "/dashboard",
      icon: sidebarIcon("/icons/smart-home.svg", "Dashboard"),
      label: "Dashboard",
    },
    {
      href: "/dashboard/ticketing",
      icon: sidebarIcon("/icons/gmail.svg", "Messages"),
      label: "Messages",
      badgeCount: pendingTicketsCount,
    },
    {
      href: "/dashboard/billing",
      icon: sidebarIcon("/icons/label.svg", "Billing"),
      label: "Billing",
    },
    {
      href: "/dashboard/agents",
      icon: sidebarIcon("/icons/ai-scan.svg", "Agents"),
      label: "Agents",
    },
    {
      href: "/dashboard/knowledge-base",
      icon: sidebarIcon("/icons/package.svg", "Knowledge Base"),
      label: "Knowledge Base",
    },
    {
      href: "/dashboard/settings",
      icon: sidebarIcon("/icons/settings.svg", "Settings"),
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
