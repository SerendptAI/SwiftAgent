"use client";

import { useState } from "react";

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
    <div className="space-y-1">
      <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {label}
      </label>
      <div className="flex items-center gap-2 overflow-hidden rounded-xl border border-gray-100 bg-white pr-1 shadow-sm">
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
        />
        <button
          onClick={handleUpdate}
          className="rounded-lg bg-[#2196F3] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1E88E5]"
        >
          {saved ? "SAVED ✓" : "UPDATE"}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Need Help Banner */}
      <div className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-[#F25430] px-8 py-6">
        {/* Decorative background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/images/swift_bg.svg')",
            backgroundSize: "cover",
          }}
        />
        <h2 className="font-stolzl relative z-10 text-2xl font-bold text-white">
          Need help?
        </h2>
        <button className="relative z-10 flex items-center gap-2 rounded-xl bg-[#2196F3] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1E88E5]">
          📞 CALL AGENT
        </button>
      </div>

      {/* Editable Fields */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        {FIELDS.map((field) => (
          <EditableField key={field.id} {...field} />
        ))}
      </div>
    </div>
  );
}
