const REASONS = [
  {
    title: "Faster Setup",
    description: "Go live in hours, not weeks.",
    accent: "#F2B035",
  },
  {
    title: "Smarter Automation",
    description: "Reduce repetitive support requests automatically.",
    accent: "#03A84E",
  },
  {
    title: "Simpler Operations",
    description: "No bloated workflows or unnecessary complexity.",
    accent: "#F25430",
  },
  {
    title: "Predictable Growth",
    description: "Scale customer support without scaling operational costs.",
    accent: "#7F9FFF",
  },
];

export function WhyTeamsSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <div className="mb-10 md:mb-14">
          <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-400 uppercase md:text-lg">
            Why teams switch
          </p>
          <h2 className="font-greed-narrow max-w-280 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            Why teams move beyond traditional support platforms
          </h2>
          <p className="font-stolzl mt-8 max-w-2xl text-base leading-relaxed text-black/70 md:text-lg">
            Whether you&apos;re using Zendesk, Intercom, Freshworks, Tidio, or
            managing support manually, the challenge is the same: more customers
            create more conversations, and more conversations create more
            support work. SwiftAgents helps you reduce that workload before it
            reaches your team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col gap-3 border border-black px-5 py-7 md:px-6 md:py-8"
            >
              <span
                className="h-1.5 w-10 rounded-full"
                style={{ backgroundColor: reason.accent }}
              />
              <h3 className="font-dm-mono text-lg leading-normal font-medium tracking-[8%] text-black uppercase md:text-xl">
                {reason.title}
              </h3>
              <p className="font-stolzl text-sm leading-normal tracking-[2%] text-black/70 md:text-base">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
