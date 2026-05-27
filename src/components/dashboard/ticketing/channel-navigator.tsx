"use client";

import { Icons } from "@/components/icons";
import { InfoTooltip } from "@/components/ui/info-tooltip";

type ChannelKey = "tickets" | "forms" | "mail";

interface Channel {
  key: ChannelKey;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count: number;
  activeBg: string;
  activeIcon: string;
  badgeBg: string;
}

const CHANNELS: Channel[] = [
  {
    key: "tickets",
    label: "Tickets",
    icon: Icons.ticketChat,
    count: 0,
    activeBg: "bg-[#F25430]",
    activeIcon: "text-white",
    badgeBg: "bg-red-500",
  },
  {
    key: "forms",
    label: "Forms",
    icon: Icons.ticketForm,
    count: 6,
    activeBg: "bg-[#F25430]",
    activeIcon: "text-white",
    badgeBg: "bg-[#6433CC]",
  },
  {
    key: "mail",
    label: "Business Emails",
    icon: Icons.ticketEmail,
    count: 6,
    activeBg: "bg-[#F25430]",
    activeIcon: "text-white",
    badgeBg: "bg-[#6433CC]",
  },
];

interface ChannelNavigatorProps {
  active: ChannelKey;
  onChange: (key: ChannelKey) => void;
}

export function ChannelNavigator({ active, onChange }: ChannelNavigatorProps) {
  return (
    <div className="scrollbar-none flex w-full items-center gap-2 overflow-x-auto rounded-[20px] bg-white p-2 shadow-sm lg:w-auto lg:flex-col lg:gap-8 lg:rounded-3xl lg:p-3">
      {CHANNELS.map((ch) => {
        const Icon = ch.icon;
        const isActive = ch.key === active;
        return (
          <InfoTooltip key={ch.key} text={ch.label} side="right">
            <button
              type="button"
              onClick={() => onChange(ch.key)}
              className={`relative flex h-13 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 transition-colors sm:h-14 lg:h-20 lg:w-20 lg:flex-none lg:px-0 ${
                isActive
                  ? `${ch.activeBg} shadow-sm`
                  : "bg-[#F6F6F6] hover:bg-gray-100"
              }`}
              aria-label={ch.label}
              aria-pressed={isActive}
            >
              <Icon
                className={`h-6 w-6 shrink-0 lg:h-10 lg:w-10 ${
                  isActive ? ch.activeIcon : "text-gray-500"
                }`}
              />
              <span
                className={`font-dm-mono sr-only truncate text-xs uppercase ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              >
                {ch.label}
              </span>
            </button>
          </InfoTooltip>
        );
      })}
    </div>
  );
}

export type { ChannelKey };
