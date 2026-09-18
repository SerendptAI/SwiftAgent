"use client";

import { NavItem } from "@/components/dashboard/nav-item";
import { Icons } from "@/components/icons";

const SETTINGS_NAV = [
  {
    href: "/dashboard/settings",
    icon: Icons.SettingsProfile,
    label: "Profile",
    activeColor: "#f25430",
    iconClassName: "h-7 w-7 md:h-9 md:w-9",
  },
  {
    href: "/dashboard/settings/company",
    icon: Icons.SettingsCompany,
    label: "Company",
    activeColor: "#6433CC",
    iconClassName: "h-7 w-7 md:h-9 md:w-9",
  },
  {
    href: "/dashboard/settings/billing",
    icon: Icons.SettingsCard,
    label: "Billing",
    activeColor: "#F2B035",
    iconClassName: "h-7 w-7 md:h-9 md:w-9",
  },
  {
    href: "/dashboard/settings/security",
    icon: Icons.SettingsSecurity,
    label: "Security",
    activeColor: "#7F9FFF",
    iconClassName: "h-7 w-7 md:h-9 md:w-9",
  },
  {
    href: "/dashboard/settings/api-keys",
    icon: Icons.SettingsApiKeys,
    label: "API Keys",
    activeColor: "#00B37E",
    iconClassName: "h-7 w-7 md:h-9 md:w-9",
  },
  {
    href: "/dashboard/settings/stroll",
    icon: Icons.SettingsStroll,
    label: "Stroll",
    activeColor: "#006BE5",
    iconClassName: "h-7 w-7 md:h-9 md:w-9",
  },
];

export function SettingsNav() {
  return (
    <aside className="grid w-full shrink-0 grid-cols-6 gap-2 rounded-[20px] bg-white p-2 shadow-sm md:py-6 lg:flex lg:w-26 lg:flex-col lg:items-center lg:justify-start lg:gap-6 lg:self-start lg:rounded-lg">
      {SETTINGS_NAV.map((item) => (
        <div key={item.href} className="flex min-w-0 justify-center">
          <NavItem {...item} className="w-full lg:w-16" />
        </div>
      ))}
    </aside>
  );
}
