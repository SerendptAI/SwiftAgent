"use client";

import { Icons } from "@/components/icons";
import { InfoTooltip } from "@/components/ui/info-tooltip";

type ChannelKey = "chats" | "tickets" | "mail";

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
    key: "chats",
    label: "Tickets",
    icon: Icons.ticketChat,
    count: 0,
    activeBg: "bg-[#F25430]",
    activeIcon: "text-white",
    badgeBg: "bg-red-500",
  },
  {
    key: "tickets",
    label: "Forms",
    icon: Icons.ticketForm,
    count: 6,
    activeBg: "bg-white",
    activeIcon: "text-gray-700",
    badgeBg: "bg-[#6433CC]",
  },
  {
    key: "mail",
    label: "Business Emails",
    icon: Icons.ticketEmail,
    count: 6,
    activeBg: "bg-white",
    activeIcon: "text-gray-700",
    badgeBg: "bg-[#6433CC]",
  },
];

interface ChannelNavigatorProps {
  active: ChannelKey;
  onChange: (key: ChannelKey) => void;
}

export function ChannelNavigator({ active, onChange }: ChannelNavigatorProps) {
  return (
    <div className="flex flex-col items-center gap-8 rounded-3xl bg-white p-3 shadow-sm">
      {CHANNELS.map((ch) => {
        const Icon = ch.icon;
        const isActive = ch.key === active;
        return (
          <InfoTooltip key={ch.key} text={ch.label} side="right">
            <button
              onClick={() => onChange(ch.key)}
              className={`relative flex h-20 w-20 items-center justify-center rounded-2xl transition-colors ${
                isActive
                  ? `${ch.activeBg} shadow-sm`
                  : "bg-[#F6F6F6] hover:bg-gray-100"
              }`}
              aria-label={ch.label}
            >
              <Icon
                className={`h-10 w-10 ${
                  isActive ? ch.activeIcon : "text-gray-500"
                }`}
              />
            </button>
          </InfoTooltip>
        );
      })}
    </div>
  );
}

export type { ChannelKey };
