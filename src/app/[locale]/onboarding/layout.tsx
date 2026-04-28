import type { Metadata } from "next";

import { AuthGuard } from "@/components/auth-check";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200/60 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F6F6F6]">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
      <AuthGuard>
        <div className="mx-auto grid h-screen w-full max-w-7xl overflow-x-hidden bg-[#F6F6F6] md:grid-cols-[105px_1fr]">
          <Sidebar />
          <div className="flex min-h-0 flex-1 flex-col">
            <Header />
            <main className="scrollbar-none flex min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:gap-6 lg:p-6">
              <div className="mx-auto flex h-fit w-full min-w-0 flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                {children}
              </div>
              <div className="hidden w-[350px] shrink-0 flex-col gap-6 lg:flex">
                {/* WidgetCard skeleton */}
                <div className="overflow-hidden rounded-xl">
                  <div className="relative">
                    <div className="absolute top-0 right-0 left-0 z-10 flex h-[48px] items-center">
                      <div className="bg-muted h-full rounded-br-md pr-4">
                        <ShimmerBlock className="h-10 w-24 rounded-md" />
                      </div>
                    </div>
                    <div className="rounded-md border border-gray-100 bg-[#EDEDED] px-5 pt-16 pb-5 shadow-sm">
                      <ShimmerBlock className="mb-4 h-8 w-28 rounded-md" />
                      <ShimmerBlock className="h-24 w-full rounded-lg" />
                      <ShimmerBlock className="mt-6 h-10 w-full rounded-md" />
                    </div>
                  </div>
                </div>
                {/* VisitorsList skeleton */}
                <div className="rounded-3xl bg-[#EDEDED] p-6 shadow-sm">
                  <ShimmerBlock className="h-44 w-full rounded-lg" />
                </div>
              </div>
            </main>
          </div>
        </div>
      </AuthGuard>
    </div>
  );
}
