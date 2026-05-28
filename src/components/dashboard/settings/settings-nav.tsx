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
];

export function SettingsNav() {
  return (
    <aside className="grid w-full shrink-0 grid-cols-4 gap-2 rounded-[20px] bg-white p-2 shadow-sm lg:flex lg:h-[400px] lg:w-[90px] lg:flex-col lg:justify-between lg:gap-6 lg:rounded-lg lg:py-6">
      {SETTINGS_NAV.map((item) => (
        <div key={item.href} className="flex min-w-0 justify-center">
          <NavItem {...item} className="w-full lg:w-16" />
        </div>
      ))}
    </aside>
  );
}
