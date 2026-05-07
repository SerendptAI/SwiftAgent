"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Icons } from "@/components/icons";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { getAuthProvider } from "@/lib/api-client";
import { getProfileImage } from "@/lib/utils";

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
  loginMethod: propLoginMethod,
  ip: propIp = "196.201.52.68",
  onLogout: propOnLogout,
}: ProfileCardProps) {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const [currentIp, setCurrentIp] = useState<string>("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
  const storedProvider = getAuthProvider();
  const isGooglePicture =
    user?.picture?.includes("googleusercontent.com") ||
    user?.picture?.includes("ggpht.com");
  const loginMethod =
    propLoginMethod ??
    (storedProvider === "google" || (!storedProvider && isGooglePicture)
      ? "Google"
      : "Email");

  const handleLogout = useCallback(() => {
    if (propOnLogout) {
      propOnLogout();
    } else {
      logoutMutation.mutate(undefined);
    }
  }, [propOnLogout, logoutMutation]);

  return (
    <aside className="flex h-[450px] w-[320px] shrink-0 flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
      {/* Avatar */}
      <div className="relative h-30 w-30 overflow-hidden rounded-full border-2 border-gray-100">
        <Image
          src={getProfileImage(user?.id)}
          alt={name || "User Avatar"}
          fill
          className="object-cover"
        />
      </div>

      {/* Name */}
      <p className="font-400 font-stolzl text-center text-xl text-gray-900">
        {name}
      </p>

      {/* Login Method */}
      <div className="font-dm-mono mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-100 px-3 py-2 text-sm font-medium text-gray-600 shadow-[-6px_6px_0px_0px_#000000]">
        <span>LOGGED IN VIA</span>
        {loginMethod === "Google" ? (
          <Icons.google className="h-4 w-4" />
        ) : (
          <span className="font-dm-mono text-sm font-semibold uppercase">
            Email
          </span>
        )}
      </div>

      {/* IP Address */}
      <div className="font-dm-mono flex w-full items-center justify-center rounded-md border border-gray-100 px-3 py-2 text-sm text-gray-500 shadow-[-6px_6px_0px_0px_#000000]">
        IP: {displayIp}
      </div>

      {/* Log Out */}
      <button
        onClick={() => setShowLogoutModal(true)}
        disabled={logoutMutation.isPending}
        className="font-dm-mono mt-auto w-full rounded-md bg-red-500 py-2.5 text-sm font-bold tracking-widest text-white uppercase shadow-[-6px_6px_0px_0px_#000000] transition-colors hover:bg-red-600 disabled:opacity-50"
      >
        {logoutMutation.isPending ? "LOGGING OUT..." : "LOG OUT"}
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setShowLogoutModal(false)}
        >
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div
            className="relative mx-4 w-full max-w-[420px] rounded-3xl bg-white px-6 py-12 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className="relative mb-6">
                <Image src="/logout.svg" alt="Logout" width={80} height={80} />
              </div>

              {/* Text */}
              <h2 className="font-greed-narrow mb-8 line-clamp-6 text-center text-4xl font-bold tracking-tight text-black uppercase">
                ARE YOU SURE YOU
                <br />
                WANT TO LOG OUT?
              </h2>

              {/* Buttons */}
              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="font-dm-mono w-full rounded-lg bg-[#006BE5] py-2 text-sm font-bold tracking-widest text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5] disabled:opacity-50"
                >
                  {logoutMutation.isPending ? "LOGGING OUT..." : "YES"}
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="font-dm-mono w-full rounded-lg border border-gray-200 bg-gray-100 py-2 text-sm font-bold tracking-widest text-gray-900 uppercase shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-gray-200"
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
