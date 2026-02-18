interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps = 5 }: ProgressBarProps) {
  return (
    <div className="mb-6 flex items-center space-x-4">
      <div className="h-4 w-full max-w-[90px] rounded-full bg-gray-100">
        <div
          className="h-full rounded-l-full bg-[#6433CC] transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <h2 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
        Company Setup
      </h2>
    </div>
  );
}
