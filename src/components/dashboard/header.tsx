"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useCurrentUser } from "@/hooks/use-auth";
import { getProfileImage } from "@/lib/utils";

import { Icons } from "../icons";
import { DashboardSearch } from "./dashboard-search";
import { NotificationsPanel } from "./notifications-panel";

export function Header() {
  const { data: user } = useCurrentUser();
  const avatarSrc = user?.picture || getProfileImage(user?.id);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="flex h-20 items-center justify-between gap-4 px-6 lg:h-[90px]">
      <div className="mt-6 flex w-[60%] items-center gap-6">
        <DashboardSearch />
        <div className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#EDEDED] px-1 py-1">
          <Icons.Questiondark className="mr-2 h-8 w-8 rounded-full bg-white p-2" />
          <span className="font-dm-mono pr-2 text-lg font-normal whitespace-nowrap">
            How to use?
          </span>
        </div>
      </div>
      <div className="relative mt-6 flex items-center gap-4">
        <InfoTooltip text="Notifications">
          <button
            ref={bellRef}
            type="button"
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
            onClick={() => setIsNotificationsOpen((open) => !open)}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-[#EDEDED] transition-colors hover:bg-[#E0E0E0]"
          >
            <Icons.bell className="h-10 w-10 p-2" />
          </button>
        </InfoTooltip>

        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={avatarSrc}
            alt={user?.name || "User avatar"}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>

        <NotificationsPanel
          open={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          triggerRef={bellRef}
        />
      </div>
    </header>
  );
}
