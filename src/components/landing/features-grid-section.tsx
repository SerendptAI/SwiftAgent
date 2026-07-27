import Image from "next/image";

const FEATURES = [
  {
    title: "Instant Customer Support",
    description:
      "Answer customer questions 24/7 across support, onboarding, billing, and product inquiries.",
    icon: "/images/home/feature-instant-support.svg",
    accent: "#7F9FFF",
  },
  {
    title: "Product Guidance",
    description:
      "Help users navigate your platform, find features, and complete actions without waiting for support.",
    icon: "/images/home/feature-product-guidance.svg",
    accent: "#F2B035",
  },
  {
    title: "Payment & Transaction Support",
    description:
      "Assist customers with payment verification, refunds, transaction status, and account-related questions.",
    icon: "/images/home/feature-payment-support.svg",
    accent: "#F25430",
  },
  {
    title: "Intelligent Knowledge Search",
    description:
      "Retrieve answers instantly from your website, documentation, and support resources.",
    icon: "/images/home/feature-knowledge-search.svg",
    accent: "#03A84E",
  },
];

export function FeaturesGridSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-360">
        <p className="font-dm-mono mb-8 text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:mb-10 md:text-[32px]">
          Everything Your Team Needs To Support Customers At Scale
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 rounded-2xl border border-[#1f1f1f] bg-[#F6F4EF] p-8 drop-shadow-[-3px_4px_0px_#000000]"
            >
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-[#1f1f1f]"
                style={{ backgroundColor: feature.accent }}
              >
                <Image src={feature.icon} alt="" width={24} height={24} />
              </div>
              <p className="font-dm-mono text-xl font-medium text-[#1f1f1f] uppercase">
                {feature.title}
              </p>
              <p className="font-stolzl text-base leading-relaxed text-black">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
