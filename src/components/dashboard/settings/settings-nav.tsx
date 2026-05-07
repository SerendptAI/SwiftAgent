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
    iconClassName: "h-12 w-12",
  },
  {
    href: "/dashboard/settings/company",
    icon: Icons.SettingsCompany,
    activeIcon: Icons.SettingsCompanyWhite,
    label: "Company",
    activeColor: "#6433CC",
    iconClassName: "h-12 w-12",
  },
  {
    href: "/dashboard/settings/billing",
    icon: Icons.SettingsCard,
    label: "Billing",
    activeColor: "#F2B035",
    iconClassName: "h-12 w-12",
  },
  {
    href: "/dashboard/settings/security",
    icon: Icons.SettingsSecurity,
    label: "Security",
    activeColor: "#7F9FFF",
    iconClassName: "h-12 w-12",
  },
];

export function SettingsNav() {
  return (
    <aside className="flex h-[400px] w-[90px] shrink-0 flex-col items-center justify-between gap-6 rounded-lg bg-white py-6 shadow-sm">
      {SETTINGS_NAV.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </aside>
  );
}
