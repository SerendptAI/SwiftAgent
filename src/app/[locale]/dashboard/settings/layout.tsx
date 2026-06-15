import { ProfileCard } from "@/components/dashboard/settings/profile-card";
import { SettingsNav } from "@/components/dashboard/settings/settings-nav";
import { SupportChatbot } from "@/components/dashboard/settings/support-chatbot";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 max-w-[1536px] flex-col gap-4 pb-6 lg:flex-row lg:gap-12 lg:pb-0">
      <SupportChatbot />
      {/* Secondary Settings Sidebar */}
      <SettingsNav />

      {/* Main Content */}
      <div className="scrollbar-none min-w-0 flex-1 overflow-visible lg:overflow-y-auto">
        {children}
      </div>

      {/* Profile Card */}
      <div className="hidden lg:block">
        <ProfileCard />
      </div>
    </div>
  );
}
