"use client";

import { Book, Bot, Building2, LayoutDashboard, Settings } from "lucide-react";

import { NavItem } from "@/components/dashboard/nav-item";

export function Sidebar() {
  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      href: "/dashboard/company-info",
      icon: Building2,
      label: "Company Information",
    },
    { href: "/dashboard/identity", icon: Bot, label: "Company Identity" },
    {
      href: "/dashboard/knowledge",
      icon: Book,
      label: "Knowledge Sources",
    },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="bg-background hidden w-20 flex-col border-r py-6 md:flex">
      <div className="flex w-full items-center justify-center p-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
          <span className="font-bold">SA</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-8">
        <nav className="flex flex-col items-center gap-4 px-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
