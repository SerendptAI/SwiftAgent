"use client";

import { Icons } from "@/components/icons";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useTickets } from "@/hooks/use-tickets";

type ChannelKey = "tickets" | "forms" | "mail";

interface Channel {
  key: ChannelKey;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeBg: string;
  activeIcon: string;
  badgeBg: string;
}

const CHANNELS: Channel[] = [
  {
    key: "tickets",
    label: "Tickets",
    icon: Icons.ticketChat,
    activeBg: "bg-[#F25430]",
    activeIcon: "text-white",
    badgeBg: "bg-red-500",
  },
  {
    key: "forms",
    label: "Forms",
    icon: Icons.ticketForm,
    activeBg: "bg-[#F25430]",
    activeIcon: "text-white",
    badgeBg: "bg-[#6433CC]",
  },
  {
    key: "mail",
    label: "Business Emails",
    icon: Icons.ticketEmail,
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
  const { data: tickets } = useTickets();
  const counts: Record<ChannelKey, number> = {
    tickets: tickets?.length ?? 0,
    forms: 0,
    mail: 0,
  };

  return (
    <div className="scrollbar-none flex w-full items-center gap-2 overflow-x-auto rounded-[20px] bg-white p-2 shadow-sm lg:w-auto lg:flex-col lg:gap-8 lg:rounded-3xl lg:p-3">
      {CHANNELS.map((ch) => {
        const Icon = ch.icon;
        const isActive = ch.key === active;
        const count = counts[ch.key];
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
              aria-label={
                count > 0 ? `${ch.label} (${count} pending)` : ch.label
              }
              aria-pressed={isActive}
            >
              <Icon
                className={`h-6 w-6 shrink-0 lg:h-10 lg:w-10 ${
                  isActive ? ch.activeIcon : "text-gray-500"
                }`}
              />
              {count > 0 && (
                <span
                  className={`absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white ${ch.badgeBg}`}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
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
