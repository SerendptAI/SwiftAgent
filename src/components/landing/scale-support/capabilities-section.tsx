const CAPABILITIES = [
  {
    title: "Instant Customer Support",
    description:
      "Answer customer questions 24/7 across support, onboarding, billing, and product inquiries.",
  },
  {
    title: "Product Guidance",
    description:
      "Help users navigate your platform, find features, and complete actions without waiting for support.",
  },
  {
    title: "Payment & Transaction Support",
    description:
      "Assist customers with payment verification, refunds, transaction status, and account-related questions.",
  },
  {
    title: "Intelligent Knowledge Search",
    description:
      "Retrieve answers instantly from your website, documentation, and support resources.",
  },
];

export function CapabilitiesSection() {
  return (
    <section className="w-full bg-[#F6F4EF] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <div className="mb-10 md:mb-14">
          <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-500 uppercase md:text-lg">
            Capabilities
          </p>
          <h2 className="font-greed-narrow max-w-280 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            Everything your team needs to support customers at scale
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CAPABILITIES.map((capability) => (
            <div
              key={capability.title}
              className="flex flex-col gap-3 border border-black bg-white px-5 py-7 md:px-6 md:py-8"
            >
              <h3 className="font-greed-narrow text-2xl leading-[1.2] font-medium tracking-[-2%] text-black uppercase md:text-3xl">
                {capability.title}
              </h3>
              <p className="font-stolzl text-sm leading-normal tracking-[2%] text-black/70 md:text-base">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
