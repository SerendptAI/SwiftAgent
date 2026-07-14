const OUTCOMES = [
  "Faster responses",
  "Less manual work",
  "Better customer experiences",
  "Lower support costs",
];

export function OutcomesSection() {
  return (
    <section className="w-full bg-[#6433CC] px-6 py-16 text-white md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-white/60 uppercase md:text-lg">
          Outcomes, not tickets
        </p>

        <h2 className="font-greed-narrow max-w-280 text-4xl leading-[1.34] font-medium tracking-[-2%] uppercase md:text-5xl lg:text-[66px]">
          Traditional support platforms help teams manage support. SwiftAgents
          helps teams reduce it.
        </h2>

        <p className="font-stolzl mt-8 max-w-2xl text-base leading-relaxed text-white/80 md:mt-10 md:text-lg">
          Most customer support platforms were built around tickets, dashboards,
          and workflows. SwiftAgents was built around outcomes.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {OUTCOMES.map((outcome) => (
            <div
              key={outcome}
              className="border border-white/30 px-5 py-6 text-center"
            >
              <span className="font-dm-mono text-sm tracking-[8%] uppercase md:text-base">
                {outcome}
              </span>
            </div>
          ))}
        </div>

        <p className="font-greed-narrow mt-12 max-w-2xl text-2xl leading-[1.4] font-medium tracking-[-2%] uppercase md:mt-16 md:text-3xl lg:text-4xl">
          This isn&apos;t another support tool. It&apos;s a customer support
          automation system.
        </p>
      </div>
    </section>
  );
}
