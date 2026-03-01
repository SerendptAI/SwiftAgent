"use client";

import { useState } from "react";

import { HelpBanner } from "@/components/dashboard/settings/help-banner";

const FIELDS = [
  {
    id: "email",
    label: "Personal Email Address",
    defaultValue: "Biotonte@yahoo.com",
    type: "email",
  },
  {
    id: "phone",
    label: "Personal Phone Number",
    defaultValue: "+2349057004914",
    type: "tel",
  },
];

function EditableField({
  label,
  defaultValue,
  type,
}: {
  label: string;
  defaultValue: string;
  type: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [saved, setSaved] = useState(false);

  const handleUpdate = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-1 p-2">
      <label className="font-stolzl mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
        {label}
      </label>
      <div className="flex items-center gap-2 overflow-hidden rounded-[5px] border bg-[#EDEDED] pr-1 shadow-sm">
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-[#EDEDED] px-4 py-3 text-sm outline-none"
        />
        <button
          onClick={handleUpdate}
          className="rounded-lg bg-[#2196F3] px-8 py-2 text-xs font-bold text-white shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5]"
        >
          {saved ? "SAVED ✓" : "UPDATE"}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-[450px] flex-col gap-6 rounded-xl bg-white p-4 shadow-sm">
      <HelpBanner bgColor="bg-[#F25430]" textColor="text-black" />

      {/* Editable Fields */}
      <div className="flex flex-col gap-4 rounded-2xl">
        {FIELDS.map((field) => (
          <EditableField key={field.id} {...field} />
        ))}
      </div>
    </div>
  );
}
