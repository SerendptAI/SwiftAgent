const STEPS = [
  {
    number: "1",
    title: "Connect your knowledge",
    description:
      "Upload your documentation, website content, FAQs, and support resources.",
    accent: "#F2B035",
  },
  {
    number: "2",
    title: "Train SwiftAgents on your business",
    description:
      "SwiftAgents learns your products, workflows, policies, and customer processes.",
    accent: "#03A84E",
  },
  {
    number: "3",
    title: "Go live",
    description:
      "Start resolving customer inquiries across your support channels in hours, not weeks.",
    accent: "#F25430",
  },
];

export function ResolutionStepsSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <div className="mb-10 md:mb-14">
          <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-400 uppercase md:text-lg">
            How it works
          </p>
          <h2 className="font-greed-narrow max-w-280 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            From customer inquiry to resolution in seconds
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col gap-5 border border-black px-5 py-7 md:px-6 md:py-8"
            >
              <span
                className="font-greed-narrow flex size-12 shrink-0 items-center justify-center rounded-full text-2xl font-medium text-white"
                style={{ backgroundColor: step.accent }}
              >
                {step.number}
              </span>
              <h3 className="font-dm-mono text-lg leading-normal font-medium tracking-[8%] text-black uppercase md:text-xl">
                {step.title}
              </h3>
              <p className="font-stolzl text-sm leading-normal tracking-[2%] text-black/70 md:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
