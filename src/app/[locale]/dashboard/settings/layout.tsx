import { ProfileCard } from "@/components/dashboard/settings/profile-card";
import { SettingsNav } from "@/components/dashboard/settings/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 max-w-7xl gap-4">
      {/* Secondary Settings Sidebar */}
      <SettingsNav />

      {/* Main Content */}
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>

      {/* Profile Card */}
      <ProfileCard />
    </div>
  );
}
