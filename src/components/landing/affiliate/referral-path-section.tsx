import { cn } from "@/lib/utils";

const STEPS = [
  { label: "You", caption: "the referrer" },
  { label: "Intro", caption: "warm handoff" },
  { label: "Business", caption: "sees a demo" },
  { label: "Live", caption: "you get paid", highlight: true },
];

export function ReferralPathSection() {
  return (
    <section className="w-full bg-[#F6F6F6] px-6 py-16 md:px-10 md:py-24 lg:px-20">
      <div className="mx-auto max-w-360">
        <div className="flex flex-col gap-3">
          <p className="font-dm-mono text-sm tracking-[0.15em] text-[#6433cc] uppercase">
            Referral path
          </p>
          <h2 className="font-greed-narrow max-w-3xl text-3xl leading-[1.1] font-medium tracking-[-0.02em] text-[#1f1f1f] uppercase md:text-4xl lg:text-5xl">
            The pathway to permanent commission
          </h2>
        </div>

        <div className="relative mt-14 px-4 md:mt-16 md:px-10">
          {/* Connector line */}
          <div className="absolute top-4 right-4 left-4 border-t border-dashed border-[#BDBDBD] md:right-10 md:left-10" />

          <div className="relative flex items-start">
            {STEPS.map((step) => (
              <div
                key={step.label}
                className="flex flex-1 flex-col items-center"
              >
                <div
                  className={cn(
                    "relative z-10 size-8 rounded-full border-2 border-black",
                    step.highlight ? "bg-[#F2B035]" : "bg-white",
                  )}
                />
                <div className="mt-3 flex flex-col items-center gap-1 text-center">
                  <span
                    className={cn(
                      "font-dm-mono text-sm tracking-[0.08em] uppercase md:text-[18px]",
                      step.highlight ? "text-[#F2B035]" : "text-[#1f1f1f]",
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      "font-stolzl text-xs md:text-sm",
                      step.highlight
                        ? "font-bold text-[#1f1f1f]"
                        : "text-[#7e7e7e]",
                    )}
                  >
                    {step.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
