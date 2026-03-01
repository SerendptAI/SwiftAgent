import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-screen w-full overflow-hidden bg-[#F6F6F6] md:grid-cols-[105px_1fr]">
      <Sidebar />
      <div className="flex h-full min-h-0 flex-col">
        <Header />
        <main className="flex h-full min-h-0 flex-1 gap-4 overflow-hidden p-4 lg:gap-6 lg:p-6">
          <div className="h-full flex-1 overflow-y-auto rounded-3xl p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
