interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const pct = Math.round(((currentStep - 1) / totalSteps) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-1 mb-1.5">
        <span className="text-xs text-muted-foreground font-medium">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-muted-foreground">{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
