import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
  variant?: "light" | "green";
}

export function CtaSection({ variant = "light" }: CtaSectionProps) {
  const isGreen = variant === "green";

  return (
    <section className="w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div
        className={cn(
          "relative mx-auto flex w-fit max-w-360 flex-col items-center overflow-hidden px-8 sm:px-12 md:px-16 lg:w-full lg:flex-row lg:px-0",
          isGreen ? "bg-[#03A84E]" : "bg-[#F2EFE9]",
        )}
      >
        {/* Left — copy */}
        <div className="relative z-10 flex flex-col pt-15 pb-12 md:w-120 md:pb-15 lg:w-[55%] lg:px-16 lg:pt-11 lg:pb-19">
          <h2
            className={cn(
              "font-greed-narrow mb-3 text-4xl leading-[1.34] font-medium tracking-[-2%] uppercase md:text-5xl lg:min-w-120 lg:text-[66px]",
              isGreen ? "text-white" : "text-black",
            )}
          >
            YOUR CUSTOMERS WANT INSTANT ANSWERS.
          </h2>
          <p
            className={cn(
              "font-stolzl mb-8 text-base leading-normal tracking-[2%] lg:mb-12",
              isGreen ? "text-white" : "text-black",
            )}
          >
            Your team wants less repetitive work. Swift Agents delivers both.
          </p>

          <div className="flex w-full max-w-107.5 flex-wrap gap-4 sm:grid sm:grid-cols-2 md:gap-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">BOOK A DEMO</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/signup">GET STARTED</Link>
            </Button>
          </div>
        </div>

        {/* Right — phone mockup */}
        <div className="absolute right-0 bottom-0 hidden h-full items-end overflow-hidden lg:flex lg:w-[48%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cta.svg"
            alt="SwiftAgent chat preview"
            className="absolute right-7 bottom-0 h-auto w-auto origin-bottom object-contain object-center"
          />
        </div>

        {/* Mobile image — inline, no rotation */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/cta-mobile.svg"
          alt="SwiftAgent chat preview"
          className="mt-6 w-full max-w-120 lg:hidden"
        />
      </div>
    </section>
  );
}
