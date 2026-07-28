import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function RoiCalculatorSection() {
  return (
    <section className="w-full bg-[#F2B035] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col items-start gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex w-full flex-1 flex-col gap-6 lg:w-auto">
          <p className="font-dm-mono text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:text-4xl">
            See how much support cost you&apos;re currently overpaying
          </p>
          <p className="font-stolzl text-base leading-relaxed text-black">
            Calculate how many support agents you could avoid hiring with
            SwiftAgents.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="w-full max-w-100 border-[#1f1f1f] lg:w-fit lg:max-w-none"
            asChild
          >
            <Link href="/demo">Calculate My Savings</Link>
          </Button>
        </div>

        <div className="w-full max-w-100 shrink-0 rounded-2xl border border-[#1f1f1f] bg-white p-6 drop-shadow-[-3px_4px_0px_#000000]">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-dm-mono text-xs font-medium text-[#1f1f1f] uppercase">
              ROI Estimator
            </span>
            <span className="size-2.5 rounded-full bg-[#F25430]" />
          </div>

          <div className="mb-4 rounded-lg border border-[#1f1f1f] bg-[#F6F4EF] p-3 text-center">
            <span className="font-dm-mono text-2xl text-[#1f1f1f]">
              $14,500/mo saved
            </span>
          </div>

          <div className="font-dm-mono flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between text-[#1f1f1f]">
              <span>Current monthly tickets</span>
              <span className="font-medium">5,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#1f1f1f]">Suggested Agents Saved</span>
              <span className="font-medium text-[#03A84E]">4 FTEs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
