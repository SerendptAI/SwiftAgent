"use client";

import { Icons } from "@/components/icons";

type ChannelKey = "chats" | "tickets" | "mail";

interface Channel {
  key: ChannelKey;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count: number;
  activeBg: string;
  activeIcon: string;
  badgeBg: string;
}

const CHANNELS: Channel[] = [
  {
    key: "chats",
    icon: Icons.ticketChat,
    count: 0,
    activeBg: "bg-[#F25430]",
    activeIcon: "text-white",
    badgeBg: "bg-red-500",
  },
  {
    key: "tickets",
    icon: Icons.ticketForm,
    count: 6,
    activeBg: "bg-white",
    activeIcon: "text-gray-700",
    badgeBg: "bg-[#6433CC]",
  },
  {
    key: "mail",
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
  chatCount?: number;
}

export function ChannelNavigator({
  active,
  onChange,
  chatCount = 0,
}: ChannelNavigatorProps) {
  return (
    <div className="flex flex-col items-center gap-8 rounded-3xl bg-white p-3 shadow-sm">
      {CHANNELS.map((ch) => {
        const Icon = ch.icon;
        const count = ch.key === "chats" ? chatCount : ch.count;
        const isActive = ch.key === active;
        return (
          <button
            key={ch.key}
            onClick={() => onChange(ch.key)}
            className={`relative flex h-20 w-20 items-center justify-center rounded-2xl transition-colors ${
              isActive
                ? `${ch.activeBg} shadow-sm`
                : "bg-white hover:bg-gray-100"
            }`}
            aria-label={ch.key}
          >
            <Icon
              className={`h-10 w-10 ${
                isActive ? ch.activeIcon : "text-gray-500"
              }`}
            />
            {count > 0 && (
              <span
                className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${ch.badgeBg}`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type { ChannelKey };
