import Image from "next/image";

export interface Plan {
  name: string;
  price: string;
  billing: string;
  description: string;
  textColor: string;
  image: string;
  features: string[];
}

interface PlanCardProps {
  plan: Plan;
  /** Pass true to show the Subscribe button (used in the dashboard) */
  showSubscribe?: boolean;
  /** Extra class applied to the root element (e.g. "pricing-card" for GSAP selectors) */
  className?: string;
}

export function PlanCard({
  plan,
  showSubscribe = false,
  className = "",
}: PlanCardProps) {
  return (
    <div
      className={`flex flex-col border border-gray-200 bg-white ${className}`}
    >
      {/* Header Image */}
      <Image
        src={plan.image}
        alt={plan.name}
        width={398}
        height={201}
        className="block h-auto w-full"
      />

      {/* Card Body */}
      <div className="flex flex-1 flex-col px-6 py-6 pb-12 font-mono">
        <h3
          className={`font-dm-mono mb-3 text-[13px] leading-none tracking-widest uppercase ${plan.textColor}`}
        >
          {plan.name}
        </h3>

        <p className="font-dm-mono mb-6 text-[13px] leading-none font-medium text-gray-900">
          {plan.price} {plan.billing}
        </p>

        <p className="mb-4 text-[11px] leading-[1.6] whitespace-pre-line text-gray-500 uppercase">
          {plan.description}
        </p>

        <ul className="font-dm-mono mt-0 space-y-3">
          {plan.features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start text-[11px] leading-[1.6] text-gray-800 uppercase"
            >
              <span className="mr-2 inline-block pt-[2px] text-[10px]">•</span>
              <span className="whitespace-pre-line">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscribe Button — dashboard only */}
      {showSubscribe && (
        <div className="px-6 pb-6">
          <button className="w-full rounded-md bg-[#2196F3] py-3 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-[#1E88E5]">
            SUBSCRIBE
          </button>
        </div>
      )}
    </div>
  );
}
