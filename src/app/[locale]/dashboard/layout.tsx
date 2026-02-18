import { Header } from "@/components/dashboard/header";
import { Phone } from "@/components/dashboard/phone";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-screen w-full overflow-hidden bg-[#F6F6F6] md:grid-cols-[105px_1fr]">
      <Sidebar />
      <div className="flex h-full flex-col">
        <Header />
        <main className="flex h-full flex-1 gap-4 overflow-hidden p-4 lg:gap-6 lg:p-6">
          <div className="h-full flex-1 overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            {children}
          </div>
          <div className="flex hidden h-full shrink-0 items-center justify-center lg:block">
            <div className="flex h-full items-start">
              <Phone />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
