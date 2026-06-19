import { AuthGuard } from "@/components/auth-check";
import { Header } from "@/components/dashboard/header";
import { SupportChatbot } from "@/components/dashboard/settings/support-chatbot";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TicketsSocket } from "@/components/dashboard/ticketing/tickets-socket";
import { MobileGate } from "@/components/mobile-gate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileGate>
      <AuthGuard>
        <TicketsSocket />
        <SupportChatbot />
        <div className="min-h-screen w-full bg-[#F6F6F6]">
          <div className="mx-auto min-h-svh w-full max-w-[1536px] overflow-visible md:grid md:h-screen md:grid-cols-[105px_1fr] md:overflow-hidden">
            <Sidebar />
            <div className="flex h-full min-h-0 min-w-0 flex-col">
              <Header />
              <main className="flex min-h-0 min-w-0 flex-1 gap-4 overflow-visible px-4 pb-24 md:h-full md:overflow-hidden md:p-4 lg:gap-6 lg:p-6">
                <div className="scrollbar-none min-h-0 min-w-0 flex-1 rounded-[20px] md:h-full md:overflow-y-auto md:rounded-3xl">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </AuthGuard>
    </MobileGate>
  );
}
