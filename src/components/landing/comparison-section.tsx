import Image from "next/image";

const COMPARISON_ROWS = [
  {
    label: "Faster responses",
    detail: "Instant vs. 2-hour queue average",
    icon: "/images/home/comparison-faster-responses.svg",
  },
  {
    label: "Less manual work",
    detail: "70% automated vs. manual triage",
    icon: "/images/home/comparison-less-manual-work.svg",
  },
  {
    label: "Better experiences",
    detail: "Zero-wait accurate resolutions",
    icon: "/images/home/comparison-better-experiences.svg",
  },
  {
    label: "Lower support costs",
    detail: "Fraction of traditional agent scale",
    icon: "/images/home/comparison-lower-costs.svg",
  },
];

export function ComparisonSection() {
  return (
    <section className="w-full border-b border-[#1f1f1f] bg-[#03A84E] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col gap-10 lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-6">
          <p className="font-dm-mono text-2xl leading-normal font-medium text-white uppercase md:text-4xl">
            Traditional Support Platforms Help Teams Manage Support. Swift
            Agents Helps Teams Reduce It.
          </p>
          <p className="font-stolzl text-base leading-relaxed text-white">
            Most customer support platforms were built around tickets,
            dashboards, and complex workflows. SwiftAgents was built around
            automated outcomes.
          </p>
          <p className="font-dm-mono text-sm font-medium text-[#F2B035] uppercase">
            &quot;This isn&apos;t another support tool. It&apos;s a customer
            support automation system.&quot;
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-[#1f1f1f] bg-white px-4 py-5 sm:flex-nowrap sm:gap-5"
            >
              <Image
                src={row.icon}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0"
              />
              <span className="font-stolzl text-base text-black">
                {row.label}
              </span>
              <span className="font-dm-mono ml-11 w-full text-sm text-[#03A84E] uppercase sm:ml-auto sm:w-auto">
                {row.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
