import { Icons } from "@/components/icons";

const POINTS = [
  "No complex implementation projects",
  "No enterprise-level setup requirements",
  "No waiting weeks to get started",
];

export function DeploySection() {
  return (
    <section className="w-full bg-[#F6F4EF] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-500 uppercase md:text-lg">
              Deployment
            </p>
            <h2 className="font-greed-narrow text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
              Deploy in hours, not weeks
            </h2>
            <p className="font-stolzl mt-8 max-w-xl text-base leading-relaxed text-black/70 md:text-lg">
              Most support systems require lengthy onboarding, configuration,
              and setup. SwiftAgents is designed to get your team live quickly
              so you can start seeing value immediately.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {POINTS.map((point) => (
              <div
                key={point}
                className="flex items-center gap-4 border border-black bg-white px-5 py-6 md:px-6"
              >
                <Icons.CheckCircle className="size-6 shrink-0" />
                <span className="font-stolzl text-base leading-normal tracking-[2%] text-black md:text-lg">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
