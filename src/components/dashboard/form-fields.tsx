import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const CONTROL_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#006BE5] disabled:cursor-not-allowed disabled:bg-gray-50";

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold tracking-[0.15em] text-gray-500"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(CONTROL_CLASS, "h-10", className)} {...props} />;
}

export function SelectInput({
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <select className={cn(CONTROL_CLASS, "h-10", className)} {...props}>
      {children}
    </select>
  );
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(CONTROL_CLASS, "min-h-[96px] py-2", className)}
      {...props}
    />
  );
}
