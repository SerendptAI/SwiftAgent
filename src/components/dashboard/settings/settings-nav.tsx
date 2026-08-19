"use client";

import { Footprints } from "lucide-react";

import { NavItem } from "@/components/dashboard/nav-item";
import { Icons } from "@/components/icons";

const SETTINGS_NAV = [
  {
    href: "/dashboard/settings",
    icon: Icons.SettingsProfile,
    activeIcon: Icons.SettingsProfileWhite,
    label: "Profile",
    activeColor: "#f25430",
    iconClassName: "h-7 w-7 md:h-12 md:w-12",
  },
  {
    href: "/dashboard/settings/company",
    icon: Icons.SettingsCompany,
    activeIcon: Icons.SettingsCompanyWhite,
    label: "Company",
    activeColor: "#6433CC",
    iconClassName: "h-7 w-7 md:h-12 md:w-12",
  },
  {
    href: "/dashboard/settings/billing",
    icon: Icons.SettingsCard,
    label: "Billing",
    activeColor: "#F2B035",
    iconClassName: "h-7 w-7 md:h-12 md:w-12",
  },
  {
    href: "/dashboard/settings/security",
    icon: Icons.SettingsSecurity,
    label: "Security",
    activeColor: "#7F9FFF",
    iconClassName: "h-7 w-7 md:h-12 md:w-12",
  },
  {
    href: "/dashboard/settings/api-keys",
    icon: Icons.KeyRound,
    label: "API Keys",
    activeColor: "#00B37E",
    iconClassName: "h-6 w-6 md:h-9 md:w-9",
  },
  {
    href: "/dashboard/settings/stroll",
    icon: Footprints,
    label: "Stroll",
    activeColor: "#006BE5",
    // Lucide draws at stroke-width 2, twice the weight of the KeyRound
    // icon beside it; stroke-1 brings it back in line with the row.
    iconClassName: "h-6 w-6 stroke-1 md:h-9 md:w-9",
  },
];

export function SettingsNav() {
  return (
    <aside className="grid w-full shrink-0 grid-cols-6 gap-2 rounded-[20px] bg-white p-2 shadow-sm lg:flex lg:w-[90px] lg:flex-col lg:items-center lg:justify-start lg:gap-6 lg:self-start lg:rounded-lg lg:py-6">
      {SETTINGS_NAV.map((item) => (
        <div key={item.href} className="flex min-w-0 justify-center">
          <NavItem {...item} className="w-full lg:w-16" />
        </div>
      ))}
    </aside>
  );
}
