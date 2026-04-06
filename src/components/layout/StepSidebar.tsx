import { Check, Circle } from "lucide-react";

interface Step {
  number: number;
  title: string;
  optional?: boolean;
}

const STEPS: Step[] = [
  { number: 1, title: "Restaurant Setup" },
  { number: 2, title: "Owner Login" },
  { number: 3, title: "Change PIN" },
  { number: 4, title: "Restaurant Profile", optional: true },
  { number: 5, title: "Tax Rate" },
  { number: 6, title: "Product Family" },
  { number: 7, title: "Menu Category" },
  { number: 8, title: "Modifier Group", optional: true },
  { number: 9, title: "Add Modifiers", optional: true },
  { number: 10, title: "Menu Item" },
];

interface StepSidebarProps {
  currentStep: number;
  completedSteps: Set<number>;
}

export function StepSidebar({ currentStep, completedSteps }: StepSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-sidebar border-r border-border p-6 gap-1">
      <h2 className="font-display text-lg text-foreground mb-6">Setup Steps</h2>
      {STEPS.map((step) => {
        const isCompleted = completedSteps.has(step.number);
        const isCurrent = step.number === currentStep;
        return (
          <div
            key={step.number}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isCurrent
                ? "bg-primary/10 border border-primary/30"
                : isCompleted
                ? "opacity-80"
                : "opacity-40"
            }`}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 ${
                isCompleted
                  ? "bg-success text-success-foreground"
                  : isCurrent
                  ? "bg-primary text-primary-foreground glow-orange-sm"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.number}
            </div>
            <div className="flex flex-col">
              <span
                className={`text-sm font-medium leading-tight ${
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              {step.optional && (
                <span className="text-[10px] text-muted-foreground/60">Optional</span>
              )}
            </div>
          </div>
        );
      })}
    </aside>
  );
}
