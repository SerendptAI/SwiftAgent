import Image from "next/image";

export interface Plan {
  name: string;
  price: string;
  /** Optional original price shown struck through (e.g. discounted from $200 → $100). */
  priceOriginal?: string;
  billing: string;
  description: string;
  textColor: string;
  image: string;
  features: string[];
  /** Backend tier slug used by the billing checkout endpoint */
  tier?: string;
  /** Number of free trial months — when present, renders an "X Months Free!" badge. */
  trialMonths?: number;
}

interface PlanCardProps {
  plan: Plan;
  /** Pass true to show the Subscribe button (used in the dashboard) */
  showSubscribe?: boolean;
  /** Extra class applied to the root element (e.g. "pricing-card" for GSAP selectors) */
  className?: string;
  /** Called when the Subscribe button is clicked */
  onSubscribe?: (plan: Plan) => void;
  /** Disables the Subscribe button (e.g. while a checkout request is pending) */
  subscribeDisabled?: boolean;
  /** Label override for the Subscribe button */
  subscribeLabel?: string;
}

export function PlanCard({
  plan,
  showSubscribe = false,
  className = "",
  onSubscribe,
  subscribeDisabled = false,
  subscribeLabel,
}: PlanCardProps) {
  return (
    <div
      className={`flex min-w-0 flex-col border border-gray-200 bg-white ${className}`}
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
      <div className="font-dm-mono flex min-w-0 flex-1 flex-col px-4 pt-4 md:px-6 md:pt-6">
        <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2 md:mb-3.5">
          <h3
            className={`text-sm leading-none tracking-widest uppercase md:text-base ${plan.textColor}`}
          >
            {plan.name}
          </h3>
          {plan.trialMonths ? (
            <span className="rounded-full bg-[#F2B035] px-2 py-0.5 text-[10px] leading-none font-bold tracking-wider text-black uppercase">
              {plan.trialMonths} Months Free!
            </span>
          ) : null}
        </div>

        <p className="mb-3 flex items-baseline gap-2 text-sm leading-none text-gray-900 md:mb-3.5 md:text-base">
          {plan.priceOriginal ? (
            <span className="text-sm text-gray-400 line-through">
              {plan.priceOriginal}
            </span>
          ) : null}
          <span>
            {plan.price} {plan.billing}
          </span>
        </p>

        <p className="mb-4 text-xs leading-relaxed tracking-wider whitespace-pre-line text-gray-500 uppercase md:mb-5 md:text-sm">
          {plan.description}
        </p>

        <ul className="mt-0">
          {plan.features.map((feature, i) => (
            <li
              key={i}
              className="mb-0 flex items-start text-xs leading-relaxed text-gray-800 uppercase md:text-sm"
            >
              <span className="mr-2 inline-block pt-[2px] text-[10px]">•</span>
              <span className="min-w-0 whitespace-pre-line">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {showSubscribe && (
        <div className="mt-6 px-4 pb-6 md:mt-8 md:px-6 md:pb-12 lg:mt-12">
          <button
            type="button"
            onClick={() => onSubscribe?.(plan)}
            disabled={subscribeDisabled}
            className="h-11 w-full cursor-pointer rounded-md bg-[#006BE5] py-1 text-xs text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all active:translate-x-[-1px] active:translate-y-[1px] active:shadow-[-1px_1px_0px_0px_#000000] disabled:cursor-not-allowed disabled:opacity-60 md:h-9 md:text-sm"
          >
            {subscribeLabel || "SUBSCRIBE"}
          </button>
        </div>
      )}
    </div>
  );
}
