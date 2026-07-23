const STEPS = [
  {
    number: "01",
    title: "Refer",
    body: "Send us the business name and website, or introduce us directly.",
  },
  {
    number: "02",
    title: "Demo",
    body: "We show the owner a working AI agent built on their own site and support flow.",
  },
  {
    number: "03",
    title: "Sign up",
    body: "If they come on board, you're logged as the referral source.",
  },
  {
    number: "04",
    title: "Get paid",
    body: "Your payout goes out once the business is active.",
  },
];

export function ProtocolSection() {
  return (
    <section className="w-full bg-[#D9F99D] px-6 py-16 md:px-10 md:py-24 lg:px-20">
      <div className="mx-auto max-w-360">
        <div className="flex flex-col gap-3">
          <p className="font-dm-mono text-sm tracking-[0.15em] text-[#111827] uppercase">
            How it works
          </p>
          <h2 className="font-greed-narrow text-3xl leading-[1.1] font-medium tracking-[-0.02em] text-[#111827] uppercase md:text-4xl lg:text-5xl">
            A simplified referral protocol
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col gap-6 rounded-lg border border-[#111827] bg-white p-8 shadow-[-3px_4px_0px_0px_#111827]"
            >
              <span className="font-dm-mono text-[32px] text-[#f25430]">
                {step.number}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-greed-narrow text-2xl font-medium text-[#111827] uppercase">
                  {step.title}
                </h3>
                <p className="font-stolzl text-[15px] leading-[1.5] text-[#374151]">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
