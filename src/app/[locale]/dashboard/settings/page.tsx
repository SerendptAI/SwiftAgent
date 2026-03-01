"use client";

import Image from "next/image";
import { useState } from "react";

import { Icons } from "@/components/icons";

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
      {/* Need Help Banner */}
      <div className="relative flex h-[150px] items-center justify-between overflow-hidden rounded-2xl bg-[#F25430] px-8 py-6">
        <Image
          src="/images/box.svg"
          alt=""
          aria-hidden="true"
          width={160}
          height={160}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100"
        />
        <h2 className="font-stolzl font-instrument-sans relative z-10 text-4xl leading-[95%] font-bold tracking-[-2%] text-black">
          Need help?
        </h2>
        <button className="relative z-10 flex items-center gap-2 rounded-md bg-[#2196F3] px-6 py-3 text-sm font-bold text-white shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5]">
          <Icons.CallAgent /> CALL AGENT
        </button>
      </div>

      {/* Editable Fields */}
      <div className="flex flex-col gap-4 rounded-2xl">
        {FIELDS.map((field) => (
          <EditableField key={field.id} {...field} />
        ))}
      </div>
    </div>
  );
}
