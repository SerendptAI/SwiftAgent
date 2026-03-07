"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Icons } from "@/components/icons";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

interface ProfileCardProps {
  name?: string;
  avatarSrc?: string;
  loginMethod?: string;
  ip?: string;
  onLogout?: () => void;
}

export function ProfileCard({
  name: propName = "Otonte Briggs",
  avatarSrc: propAvatarSrc,
  loginMethod = "Google",
  ip: propIp = "196.201.52.68",
  onLogout: propOnLogout,
}: ProfileCardProps) {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const [currentIp, setCurrentIp] = useState<string>("");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        if (data.ip) {
          setCurrentIp(data.ip);
        }
      })
      .catch((error) => console.error("Error fetching IP:", error));
  }, []);

  const name = user?.name || propName;
  const avatarSrc = user?.picture || propAvatarSrc;
  const displayIp = currentIp || propIp;

  const handleLogout = () => {
    if (propOnLogout) {
      propOnLogout();
    } else {
      logoutMutation.mutate(undefined);
    }
  };

  return (
    <aside className="flex h-[450px] w-[320px] shrink-0 flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
      {/* Avatar */}
      <div className="relative h-30 w-30 overflow-hidden rounded-full border-2 border-gray-100">
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={name || "User Avatar"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-300 to-orange-500 text-2xl font-bold text-white">
            {name?.charAt(0) || "U"}
          </div>
        )}
      </div>

      {/* Name */}
      <p className="font-400 font-stolzl text-center text-xl text-gray-900">
        {name}
      </p>

      {/* Login Method */}
      <div className="font-dm-mono mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-100 px-3 py-2 text-sm font-medium text-gray-600 shadow-[-6px_6px_0px_0px_#000000]">
        <span>LOGGED IN VIA</span>
        {loginMethod === "Google" && <Icons.google className="h-4 w-4" />}
      </div>

      {/* IP Address */}
      <div className="font-dm-mono flex w-full items-center justify-center rounded-md border border-gray-100 px-3 py-2 text-sm text-gray-500 shadow-[-6px_6px_0px_0px_#000000]">
        IP: {displayIp}
      </div>

      {/* Log Out */}
      <button
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        className="font-dm-mono mt-auto w-full rounded-md bg-red-500 py-2.5 text-sm font-bold tracking-widest text-white uppercase shadow-[-6px_6px_0px_0px_#000000] transition-colors hover:bg-red-600 disabled:opacity-50"
      >
        {logoutMutation.isPending ? "LOGGING OUT..." : "LOG OUT"}
      </button>
    </aside>
  );
}
