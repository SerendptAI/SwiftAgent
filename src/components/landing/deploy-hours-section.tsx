import { Check } from "lucide-react";

const POINTS = [
  "No complex implementation projects.",
  "No enterprise-level setup requirements.",
  "No waiting weeks to get started.",
];

export function DeployHoursSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="font-dm-mono text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:text-[32px]">
            Deploy In Hours, Not Weeks
          </p>
          <p className="font-stolzl max-w-3xl text-base leading-relaxed text-black">
            Most support systems require lengthy onboarding, configuration, and
            setup. Swift Agents is designed to get your team live quickly so you
            can start seeing value immediately.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {POINTS.map((point) => (
            <div key={point} className="flex items-center gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#03A84E]">
                <Check className="size-3 text-white" strokeWidth={3} />
              </span>
              <span className="font-stolzl text-base text-black">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
