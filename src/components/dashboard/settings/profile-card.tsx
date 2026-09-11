"use client";

import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/toast";
import {
  useCurrentUser,
  useLogout,
  useUpdateUserName,
  useUploadUserPfp,
} from "@/hooks/use-auth";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { getAuthProvider } from "@/lib/api-client";
import { getProfileImage } from "@/lib/utils";

const ACCEPTED_PFP_TYPES = "image/jpeg,image/png,image/webp,image/gif";
const MAX_PFP_BYTES = 5 * 1024 * 1024;

interface ProfileCardProps {
  name?: string;
  loginMethod?: string;
  ip?: string;
  onLogout?: () => void;
}

export function ProfileCard({
  name: propName = "John Doe",
  loginMethod: propLoginMethod,
  ip: propIp,
  onLogout: propOnLogout,
}: ProfileCardProps) {
  const { data: user } = useCurrentUser();
  const toast = useToast();
  const logoutMutation = useLogout();
  const { mutateAsync: uploadUserPfp, isPending: isUploadingPfp } =
    useUploadUserPfp();
  const { mutateAsync: updateUserName, isPending: isSavingName } =
    useUpdateUserName();

  const [currentIp, setCurrentIp] = useState<string>("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const pfpInputRef = useRef<HTMLInputElement>(null);
  useScrollLock(showLogoutModal);

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

  const handlePfpChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PFP_BYTES) {
      toast.error("Image must be under 5 MB.");
      if (pfpInputRef.current) pfpInputRef.current.value = "";
      return;
    }
    try {
      await uploadUserPfp(file);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload picture.");
    } finally {
      if (pfpInputRef.current) pfpInputRef.current.value = "";
    }
  };

  const startEditingName = () => {
    setNameDraft(user?.name || "");
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setNameDraft("");
  };

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;
    try {
      await updateUserName(trimmed);
      setIsEditingName(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update name.");
    }
  };

  return (
    <aside className="flex w-full shrink-0 flex-col items-center gap-4 rounded-[20px] bg-white p-4 shadow-sm lg:h-[450px] lg:w-[320px] lg:rounded-3xl lg:p-6">
      <div className="relative h-24 w-24 lg:h-30 lg:w-30">
        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-gray-100">
          <Image
            src={user?.picture || getProfileImage(user?.id)}
            alt={name || "User Avatar"}
            fill
            className="object-cover"
          />
        </div>
        <button
          type="button"
          onClick={() => pfpInputRef.current?.click()}
          disabled={isUploadingPfp}
          aria-label="Change profile picture"
          className="absolute right-0 bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#2196F3] text-white shadow-sm transition-colors hover:bg-[#1E88E5] disabled:opacity-60"
        >
          {isUploadingPfp ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Icons.EditProfile className="h-3.5 w-3.5" />
          )}
        </button>
        <input
          ref={pfpInputRef}
          type="file"
          accept={ACCEPTED_PFP_TYPES}
          onChange={handlePfpChange}
          className="hidden"
        />
      </div>

      {isEditingName ? (
        <div className="flex w-full items-center justify-center gap-2">
          <input
            ref={(el) => {
              el?.focus();
            }}
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder="Display name"
            disabled={isSavingName}
            className="font-stolzl min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-center text-base text-gray-900 outline-none focus:border-[#2196F3]"
          />
          <button
            type="button"
            onClick={saveName}
            disabled={isSavingName || !nameDraft.trim()}
            aria-label="Save name"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#2196F3] text-white transition-colors hover:bg-[#1E88E5] disabled:opacity-50"
          >
            {isSavingName ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={cancelEditingName}
            disabled={isSavingName}
            aria-label="Cancel"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <p className="font-400 font-stolzl text-center text-xl text-gray-900">
            {name}
          </p>
          <button
            type="button"
            onClick={startEditingName}
            aria-label="Edit display name"
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <Icons.pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="font-dm-mono mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-gray-100 px-3 py-2 text-xs font-medium text-gray-600 shadow-[-4px_4px_0px_0px_#000000] lg:mt-6 lg:text-sm lg:shadow-[-6px_6px_0px_0px_#000000]">
        <span>LOGGED IN VIA</span>
        {loginMethod === "Google" ? (
          <Icons.google className="h-4 w-4" />
        ) : (
          <span className="font-dm-mono text-sm font-semibold uppercase">
            Email
          </span>
        )}
      </div>

      <div className="font-dm-mono flex w-full items-center justify-center rounded-md border border-gray-100 px-3 py-2 text-xs text-gray-500 shadow-[-4px_4px_0px_0px_#000000] lg:text-sm lg:shadow-[-6px_6px_0px_0px_#000000]">
        IP: {displayIp}
      </div>

      <button
        onClick={() => setShowLogoutModal(true)}
        disabled={logoutMutation.isPending}
        className="font-dm-mono mt-2 w-full rounded-md bg-red-500 py-2.5 text-xs font-bold tracking-widest text-white uppercase shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-red-600 disabled:opacity-50 lg:mt-auto lg:text-sm lg:shadow-[-6px_6px_0px_0px_#000000]"
      >
        {logoutMutation.isPending ? "LOGGING OUT..." : "LOG OUT"}
      </button>

      {showLogoutModal && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setShowLogoutModal(false)}
        >
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div
            className="relative mx-4 w-full max-w-[420px] rounded-3xl bg-white px-5 py-8 shadow-xl sm:px-6 sm:py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <Image src="/logout.svg" alt="Logout" width={80} height={80} />
              </div>

              <h2 className="font-greed mb-8 line-clamp-6 text-center text-3xl font-bold tracking-tight text-black uppercase sm:text-4xl">
                ARE YOU SURE YOU
                <br />
                WANT TO LOG OUT?
              </h2>

              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="font-dm-mono w-full rounded-lg bg-[#006BE5] py-2 text-sm font-bold tracking-widest text-white uppercase shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5] disabled:opacity-50"
                >
                  {logoutMutation.isPending ? "LOGGING OUT..." : "YES"}
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="font-dm-mono w-full rounded-lg border border-gray-200 bg-gray-100 py-2 text-sm font-bold tracking-widest text-gray-900 uppercase shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-gray-200"
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
