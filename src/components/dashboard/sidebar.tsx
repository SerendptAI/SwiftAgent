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
    <aside className="bg-background hidden w-24 flex-col border-r py-8 md:flex">
      <div className="flex w-full items-center justify-center p-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
          <span className="text-xl font-bold">SA</span>
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
