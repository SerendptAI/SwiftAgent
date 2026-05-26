import { AuthGuard } from "@/components/auth-check";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileGate } from "@/components/mobile-gate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileGate>
      <AuthGuard>
        <div className="min-h-screen w-full bg-[#F6F6F6]">
          <div className="mx-auto grid h-screen w-full max-w-[1536px] overflow-hidden md:grid-cols-[105px_1fr]">
            <Sidebar />
            <div className="flex h-full min-h-0 flex-col">
              <Header />
              <main className="flex h-full min-h-0 flex-1 gap-4 overflow-hidden p-4 lg:gap-6 lg:p-6">
                <div className="scrollbar-none h-full flex-1 overflow-y-auto rounded-3xl">
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
