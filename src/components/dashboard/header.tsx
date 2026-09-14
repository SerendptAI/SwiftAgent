"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { type RefObject, useEffect, useRef, useState } from "react";

import { ProfileCard } from "@/components/dashboard/settings/profile-card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useCurrentUser } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { getProfileImage } from "@/lib/utils";

import { Icons } from "../icons";
import { DashboardSearch } from "./dashboard-search";
import { NotificationsPanel } from "./notifications-panel";

export function Header() {
  const { data: user } = useCurrentUser();
  const { data: notifications } = useNotifications(20);
  const unreadCount = notifications?.unread_count ?? 0;
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [notificationsOpenFor, setNotificationsOpenFor] = useState<
    "mobile" | "desktop" | null
  >(null);
  const mobileBellRef = useRef<HTMLButtonElement>(null);
  const desktopBellRef = useRef<HTMLButtonElement>(null);
  useScrollLock(isMobileProfileOpen);

  useEffect(() => {
    if (!isMobileProfileOpen) return;

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (mediaQuery.matches) setIsMobileProfileOpen(false);
    };

    closeOnDesktop();
    mediaQuery.addEventListener("change", closeOnDesktop);
    return () => mediaQuery.removeEventListener("change", closeOnDesktop);
  }, [isMobileProfileOpen]);

  useEffect(() => {
    if (!isMobileProfileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileProfileOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileProfileOpen]);

  const avatarSrc = user?.picture || getProfileImage(user?.id);

  const avatar = (
    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
      <Image
        src={avatarSrc}
        alt={user?.name || "User avatar"}
        width={40}
        height={40}
        className="h-full w-full object-cover"
      />
    </div>
  );

  const renderNotificationButton = (
    target: "mobile" | "desktop",
    ref: RefObject<HTMLButtonElement | null>,
  ) => (
    <InfoTooltip text="Notifications">
      <button
        ref={ref}
        type="button"
        aria-label="Notifications"
        aria-expanded={notificationsOpenFor === target}
        onClick={() =>
          setNotificationsOpenFor((openFor) =>
            openFor === target ? null : target,
          )
        }
        className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-md bg-[#EDEDED] transition-colors hover:bg-[#E0E0E0] md:h-12 md:w-12"
      >
        <Icons.bell className="h-9 w-9 p-2 md:h-10 md:w-10" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-white bg-[#F2B035] px-1 text-[10px] leading-none font-medium text-black">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </InfoTooltip>
  );

  const howToButton = (
    <div
      data-swift-agent-help
      className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#EDEDED] px-1 py-1"
    >
      <Icons.Questiondark className="h-8 w-8 rounded-full bg-white p-2 md:mr-2" />
      <span className="hidden pr-2 text-base font-normal whitespace-nowrap sm:block md:text-lg">
        How to use?
      </span>
    </div>
  );

  return (
    <header className="flex flex-col gap-3 px-4 py-4 md:h-20 md:flex-row md:items-center md:justify-between md:gap-4 md:px-6 md:py-0 lg:h-[90px]">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#F2B035]">
          <div className="relative h-6 w-6">
            <Image
              src="/images/mask.svg"
              alt="Swift Agents"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {howToButton}
          <div className="relative">
            {renderNotificationButton("mobile", mobileBellRef)}
            <NotificationsPanel
              open={notificationsOpenFor === "mobile"}
              onClose={() => setNotificationsOpenFor(null)}
              triggerRef={mobileBellRef}
            />
          </div>
          <button
            type="button"
            aria-label="Open profile"
            onClick={() => setIsMobileProfileOpen(true)}
            className="cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {avatar}
          </button>
        </div>
      </div>

      <div className="flex w-full items-center gap-3 md:mt-6 md:w-[60%] md:gap-6">
        <DashboardSearch />
        <div className="hidden md:block">{howToButton}</div>
      </div>
      <div className="hidden items-center gap-4 md:mt-6 md:flex">
        <div className="relative">
          {renderNotificationButton("desktop", desktopBellRef)}
          <NotificationsPanel
            open={notificationsOpenFor === "desktop"}
            onClose={() => setNotificationsOpenFor(null)}
            triggerRef={desktopBellRef}
          />
        </div>
        {avatar}
      </div>

      {isMobileProfileOpen && (
        <div className="fixed inset-0 z-10000 md:hidden">
          <button
            type="button"
            aria-label="Close profile"
            className="absolute inset-0 cursor-default bg-black/45"
            onClick={() => setIsMobileProfileOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Profile"
            className="absolute top-4 right-4 left-4 max-h-[calc(100svh-2rem)] overflow-y-auto"
          >
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                aria-label="Close profile"
                onClick={() => setIsMobileProfileOpen(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ProfileCard />
          </section>
        </div>
      )}
    </header>
  );
}
