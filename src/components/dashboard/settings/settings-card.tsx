import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { cn } from "@/lib/utils";

export const SETTINGS_CARD_CLASS =
  "flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4";

/** The white card every settings page lives in, opening with the help banner. */
export function SettingsCard({
  accent,
  className,
  children,
}: {
  /** Tailwind background class matching the page's nav colour. */
  accent: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(SETTINGS_CARD_CLASS, className)}>
      <HelpBanner bgColor={accent} />
      {children}
    </div>
  );
}

export function SettingsSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-stolzl text-base font-bold text-gray-900 sm:text-lg">
            {title}
          </h3>
          {description && (
            <p className="font-dm-mono mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function SettingsNotice({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning";
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-dm-mono rounded-xl px-4 py-3 text-xs",
        tone === "info" && "bg-[#006BE5]/5 text-[#0055B8]",
        tone === "warning" && "bg-amber-50 text-amber-800",
      )}
    >
      {children}
    </p>
  );
}
