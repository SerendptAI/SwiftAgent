"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { useCurrentUser, useUpdateProfile } from "@/hooks/use-auth";

// ── Component ──────────────────────────────────────────────────────────────────

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
      alert("Failed to save changes.");
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

export default function SettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const [savingFieldId, setSavingFieldId] = useState<string | null>(null);

  const handleSave = async (id: string, value: string) => {
    setSavingFieldId(id);
    try {
      if (id === "email") {
        await updateProfile({ personal_email: value });
      } else if (id === "phone") {
        await updateProfile({ personal_phone: value });
      }
    } finally {
      setSavingFieldId(null);
    }
  };

  const fields = [
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

  return (
    <div className="flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4">
      <HelpBanner bgColor="bg-[#F25430]" textColor="text-black" />

      {/* Editable Fields */}
      <div className="flex flex-col gap-4 rounded-2xl">
        {fields.map((field) => (
          <EditableField
            key={field.id}
            id={field.id}
            label={field.label}
            value={field.value}
            type={field.type}
            onSave={handleSave}
            isPending={isPending && savingFieldId === field.id}
          />
        ))}
      </div>
    </div>
  );
}
