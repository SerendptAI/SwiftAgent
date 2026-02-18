import Link from "next/link";

export function ResourcesCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-sm">
      {/* Abstract Graphic */}
      <div className="mb-8 flex flex-col items-center gap-1.5">
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-t-lg bg-[#7F9FFF]"></div>
          <div className="h-6 w-16 rounded-t-lg bg-[#7F9FFF]"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-48 rounded-lg bg-[#F2B031]"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-48 rounded-lg bg-[#6433CC]"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-48 rounded-b-2xl bg-[#F25430]"></div>
        </div>
      </div>

      <Link href="#" className="font-semibold text-[#3B82F6] hover:underline">
        Resources
      </Link>
    </div>
  );
}
