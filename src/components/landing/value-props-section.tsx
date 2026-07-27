import { Check } from "lucide-react";

const VALUE_PROPS = [
  {
    title: "Reduce Repetitive Requests",
    description:
      "Automate up to 70% of common tier-1 inquiries instantly without human intervention.",
    accent: "#F2B035",
  },
  {
    title: "Improve Response Times",
    description:
      "Instantly respond to customers 24/7 across every channel, reducing wait times to zero.",
    accent: "#F25430",
  },
  {
    title: "Deliver Better Experiences",
    description:
      "Empower customers with accurate, precise answers pulled directly from your docs.",
    accent: "#7F9FFF",
  },
  {
    title: "Scale Support Efficiently",
    description:
      "Handle 10x your current conversation volume without expanding your operational costs.",
    accent: "#03A84E",
  },
];

export function ValuePropsSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-360">
        <p className="font-dm-mono mb-8 text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:mb-10 md:text-[32px]">
          Built For Businesses Growing Faster Than Their Support Teams
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.title}
              className="flex flex-col gap-4 rounded-xl border border-[#1f1f1f] bg-[#F6F4EF] p-6 drop-shadow-[-3px_4px_0px_#000000]"
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#1f1f1f]"
                style={{ backgroundColor: prop.accent }}
              >
                <Check className="size-4 text-white" strokeWidth={3} />
              </div>
              <p className="font-dm-mono text-lg font-medium text-[#1f1f1f] uppercase">
                {prop.title}
              </p>
              <p className="font-stolzl text-base leading-relaxed text-black">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
