const INDUSTRIES = [
  {
    label: "E-Commerce",
    description:
      "Automate order tracking, refunds, and delivery inquiries at scale.",
    image: "/images/home/industry-ecommerce.svg",
  },
  {
    label: "ESaaS",
    description:
      "Handle onboarding, troubleshooting, and product guidance automatically.",
    image: "/images/home/industry-esaas.svg",
  },
  {
    label: "Fintech",
    description:
      "Support transactions, verification requests, and account inquiries with precision.",
    image: "/images/home/industry-fintech.svg",
  },
  {
    label: "Digital Platforms",
    description:
      "Manage high-volume customer interactions without growing your team.",
    image: "/images/home/industry-digital-platforms.svg",
  },
];

export function IndustriesSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        {/* Header */}
        <div className="mb-10 text-center md:mb-14 md:text-left">
          <p className="font-dm-mono mb-4 text-xs tracking-[0.2em] text-gray-500 uppercase md:text-sm">
            BUILT FOR YOUR INDUSTRY
          </p>
          <h2 className="font-greed-narrow max-w-240 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            WORKS FOR BUSINESSES <br className="hidden md:block" /> GROWING
            FASTER THAN THEIR TEAMS
          </h2>
        </div>

        {/* Industry cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4 xl:gap-15">
          {INDUSTRIES.map((industry, i) => (
            <div key={i} className="flex flex-col gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={industry.image}
                alt={industry.label}
                className="aspect-297/185 h-auto w-auto object-cover"
              />
              <p className="font-stolzl text-base leading-normal tracking-[2%] text-black xl:text-lg">
                <span className="font-bold">{industry.label}:</span>{" "}
                {industry.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
