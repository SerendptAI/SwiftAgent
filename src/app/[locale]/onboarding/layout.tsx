import { AuthGuard } from "@/components/auth-check";
import { Header } from "@/components/dashboard/header";
import { Phone } from "@/components/dashboard/phone";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F6F6F6]">
      {/* <AuthGuard> */}
      <div className="mx-auto grid h-screen w-full max-w-7xl overflow-x-hidden bg-[#F6F6F6] md:grid-cols-[105px_1fr]">
        <Sidebar />
        <div className="flex min-h-0 flex-1 flex-col">
          <Header />
          <main className="scrollbar-none flex min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:gap-6 lg:p-6">
            <div className="mx-auto flex h-fit w-full min-w-0 flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
              {children}
            </div>
            <div className="hidden h-full shrink-0 items-center justify-center lg:flex">
              <div className="flex h-full items-start">
                <Phone />
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* </AuthGuard> */}
    </div>
  );
}
