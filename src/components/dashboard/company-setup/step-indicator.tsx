import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="font-dm-mono mb-8 overflow-x-auto">
      <div className="flex border-b border-gray-100">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const stepColors = [
            "bg-[#6433CC]", // Purple
            "bg-orange-300", // Orange
            "bg-pink-300", // Pink
            "bg-violet-300", // Lavender
            "bg-yellow-100", // Yellow
          ];
          const barColor = stepColors[index] || "bg-gray-200";

          return (
            <div
              key={step}
              className={cn(
                "relative cursor-default px-6 py-4 text-xs font-medium transition-colors",
                isActive ? "text-gray-900" : "text-gray-400",
              )}
            >
              {step}
              <div
                className={cn(
                  "absolute bottom-0 left-0 h-1 w-full rounded-t-full",
                  barColor,
                  index > currentStep && "opacity-40",
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
