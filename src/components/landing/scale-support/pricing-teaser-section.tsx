import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const TIERS = [
  {
    name: "Starter",
    description: "For early-stage teams automating support for the first time.",
    accent: "#F2B035",
  },
  {
    name: "Growth",
    description: "For growing businesses handling increasing support volume.",
    accent: "#6433CC",
  },
  {
    name: "Enterprise",
    description:
      "For organizations requiring advanced customization and scale.",
    accent: "#F25430",
  },
];

export function PricingTeaserSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <div className="mb-10 text-center md:mb-14">
          <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-400 uppercase md:text-lg">
            Pricing
          </p>
          <h2 className="font-greed-narrow mx-auto max-w-200 text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            Simple pricing for every stage of growth
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col gap-3 border border-black px-5 py-8 text-center md:px-6"
            >
              <span
                className="mx-auto h-1.5 w-10 rounded-full"
                style={{ backgroundColor: tier.accent }}
              />
              <h3 className="font-greed-narrow text-2xl leading-[1.2] font-medium tracking-[-2%] text-black uppercase md:text-3xl">
                {tier.name}
              </h3>
              <p className="font-stolzl text-sm leading-normal tracking-[2%] text-black/70 md:text-base">
                {tier.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-14">
          <Button size="lg" asChild>
            <Link href="/#pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
