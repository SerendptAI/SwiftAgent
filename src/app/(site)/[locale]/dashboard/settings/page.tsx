"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { useToast } from "@/components/ui/toast";
import {
  useCurrentUser,
  useUpdateProfile,
  useUpdateUserName,
  useUploadUserPfp,
} from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api-error";
import { getProfileImage } from "@/lib/utils";

function EditableField({
  id,
  label,
  value,
  type,
  onSave,
  isPending,
}: {
  id: string;
  label: string;
  value: string;
  type: string;
  onSave: (id: string, value: string) => Promise<void>;
  isPending: boolean;
}) {
  const [localValue, setLocalValue] = useState(value);
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleUpdate = async () => {
    try {
      await onSave(id, localValue);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save changes.");
    }
  };

  return (
    <div className="space-y-1 p-0 sm:p-2">
      <label className="font-stolzl mb-3 block text-xs font-semibold tracking-wider text-gray-500 uppercase sm:mb-4 sm:text-sm">
        {label}
      </label>
      <div className="flex flex-col gap-2 overflow-hidden rounded-[5px] border bg-[#EDEDED] p-2 shadow-sm sm:flex-row sm:items-center sm:p-0 sm:pr-1">
        <input
          type={type}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="font-stolzl min-w-0 flex-1 bg-[#EDEDED] px-2 py-2.5 text-sm outline-none sm:px-4 sm:py-3"
        />
        <button
          onClick={handleUpdate}
          disabled={isPending}
          className="flex h-10 items-center justify-center rounded-lg bg-[#2196F3] px-5 text-xs font-bold text-white shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5] disabled:opacity-50 sm:h-auto sm:px-8 sm:py-2"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            "SAVED ✓"
          ) : (
            "UPDATE"
          )}
        </button>
      </div>
    </div>
  );
}

const ACCEPTED_PFP_TYPES = "image/jpeg,image/png,image/webp,image/gif";
const MAX_PFP_BYTES = 5 * 1024 * 1024;

export default function SettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const { mutateAsync: updateUserName, isPending: isSavingName } =
    useUpdateUserName();
  const { mutateAsync: uploadUserPfp, isPending: isUploadingPfp } =
    useUploadUserPfp();
  const [savingFieldId, setSavingFieldId] = useState<string | null>(null);
  const [pfpError, setPfpError] = useState<string | null>(null);
  const pfpInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (id: string, value: string) => {
    setSavingFieldId(id);
    try {
      if (id === "email") {
        await updateProfile({ personal_email: value });
      } else if (id === "phone") {
        await updateProfile({ personal_phone: value });
      } else if (id === "name") {
        await updateUserName(value);
      }
    } finally {
      setSavingFieldId(null);
    }
  };

  const handlePfpChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPfpError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PFP_BYTES) {
      setPfpError("Image must be under 5 MB.");
      if (pfpInputRef.current) pfpInputRef.current.value = "";
      return;
    }
    try {
      await uploadUserPfp(file);
    } catch (err) {
      setPfpError(getApiErrorMessage(err, "Failed to upload picture."));
    } finally {
      if (pfpInputRef.current) pfpInputRef.current.value = "";
    }
  };

  const fields = [
    {
      id: "name",
      label: "Display Name",
      value: user?.name || "",
      type: "text",
    },
    {
      id: "email",
      label: "Personal Email Address",
      value: user?.personal_email || user?.email || "",
      type: "email",
    },
    {
      id: "phone",
      label: "Personal Phone Number",
      value: user?.personal_phone || "",
      type: "tel",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-[20px] bg-white p-4 shadow-sm sm:min-h-[450px] sm:rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const avatarSrc = user?.picture || getProfileImage(user?.id);
  const displayName = user?.name || user?.email || "User";

  return (
    <div className="flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4">
      <HelpBanner bgColor="bg-[#F25430]" textColor="text-black" />

      {/* Profile picture */}
      <div className="flex items-center gap-4 p-2">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-100">
          <Image
            src={avatarSrc}
            alt={displayName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-stolzl text-sm font-semibold text-gray-900">
            Profile Picture
          </span>
          <span className="font-stolzl text-xs text-gray-400">
            JPG, PNG, WebP or GIF. Max 5 MB.
          </span>
          <button
            type="button"
            onClick={() => pfpInputRef.current?.click()}
            disabled={isUploadingPfp}
            className="font-dm-mono mt-2 self-start rounded-lg bg-[#2196F3] px-6 py-2 text-xs font-bold text-white shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5] disabled:opacity-50"
          >
            {isUploadingPfp ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                UPLOADING…
              </span>
            ) : user?.picture ? (
              "REPLACE"
            ) : (
              "UPLOAD"
            )}
          </button>
          {pfpError && (
            <span className="font-stolzl mt-1 text-xs text-red-500">
              {pfpError}
            </span>
          )}
        </div>
        <input
          ref={pfpInputRef}
          type="file"
          accept={ACCEPTED_PFP_TYPES}
          onChange={handlePfpChange}
          className="hidden"
        />
      </div>

      {/* Editable Fields */}
      <div className="flex flex-col gap-4 rounded-2xl">
        {fields.map((field) => {
          const fieldIsPending =
            field.id === "name"
              ? isSavingName && savingFieldId === field.id
              : isPending && savingFieldId === field.id;
          return (
            <EditableField
              key={field.id}
              id={field.id}
              label={field.label}
              value={field.value}
              type={field.type}
              onSave={handleSave}
              isPending={fieldIsPending}
            />
          );
        })}
      </div>
    </div>
  );
}
