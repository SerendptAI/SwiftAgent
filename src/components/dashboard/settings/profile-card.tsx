"use client";

import Image from "next/image";

import { Icons } from "@/components/icons";

interface ProfileCardProps {
  name?: string;
  avatarSrc?: string;
  loginMethod?: string;
  ip?: string;
  onLogout?: () => void;
}

export function ProfileCard({
  name = "Otonte Briggs",
  avatarSrc,
  loginMethod = "Google",
  ip = "196.201.52.68",
  onLogout,
}: ProfileCardProps) {
  return (
    <aside className="flex h-[450px] w-[320px] shrink-0 flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
      {/* Avatar */}
      <div className="relative h-30 w-30 overflow-hidden rounded-full border-2 border-gray-100">
        {avatarSrc ? (
          <Image src={avatarSrc} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-300 to-orange-500 text-2xl font-bold text-white">
            {name.charAt(0)}
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
        IP: {ip}
      </div>

      {/* Log Out */}
      <button
        onClick={onLogout}
        className="font-dm-mono mt-auto w-full rounded-md bg-red-500 py-2.5 text-sm font-bold tracking-widest text-white uppercase shadow-[-6px_6px_0px_0px_#000000] transition-colors hover:bg-red-600"
      >
        LOG OUT
      </button>
    </aside>
  );
}
