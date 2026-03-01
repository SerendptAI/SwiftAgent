"use client";

import { NavItem } from "@/components/dashboard/nav-item";
import { Icons } from "@/components/icons";

const SETTINGS_NAV = [
  {
    href: "/dashboard/settings",
    icon: Icons.SettingsProfile,
    activeIcon: Icons.SettingsProfileWhite,
    label: "Profile",
    activeColor: "#f25430",
    iconClassName: "h-10 w-10",
  },
  {
    href: "/dashboard/settings/integrations",
    icon: Icons.SettingsCompany,
    activeIcon: Icons.SettingsCompanyWhite,
    label: "Integrations",
    activeColor: "#6433CC",
    iconClassName: "h-10 w-10",
  },
  {
    href: "/dashboard/settings/billings",
    icon: Icons.SettingsCard,
    label: "Billings",
    activeColor: "#F2B035",
    iconClassName: "h-10 w-10",
  },
  {
    href: "/dashboard/settings/notifications",
    icon: Icons.SettingsSecurity,
    label: "Notifications",
    activeColor: "#7F9FFF",
    iconClassName: "h-10 w-10",
  },
];

export function SettingsNav() {
  return (
    <aside className="flex h-[450px] w-[90px] shrink-0 flex-col items-center justify-between gap-6 rounded-xl bg-white py-6 shadow-sm">
      {SETTINGS_NAV.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </aside>
  );
}
