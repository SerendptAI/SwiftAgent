import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface RoiCalloutBannerProps {
  eyebrow: string;
  heading: string;
  description: string;
  cta: string;
  variant?: "light" | "dark";
}

export function RoiCalloutBanner({
  eyebrow,
  heading,
  description,
  cta,
  variant = "light",
}: RoiCalloutBannerProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "w-full px-6 py-16 md:px-10 md:py-20 lg:px-16",
        isDark ? "bg-black text-white" : "bg-[#03A84E] text-white",
      )}
    >
      <div className="mx-auto flex max-w-360 flex-col items-center text-center">
        <p className="mb-4 text-sm tracking-[0.2em] text-white/70 uppercase md:text-base">
          {eyebrow}
        </p>
        <h2 className="font-greed max-w-200 text-3xl leading-[1.34] font-medium tracking-[-2%] uppercase md:text-4xl lg:text-5xl">
          {heading}
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          {description}
        </p>
        <Button
          size="lg"
          className="mt-8 border-transparent bg-white text-black hover:bg-white/90 md:mt-10"
          asChild
        >
          <Link href="/demo">{cta}</Link>
        </Button>
      </div>
    </section>
  );
}
