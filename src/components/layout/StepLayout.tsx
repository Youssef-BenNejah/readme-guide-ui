import { ReactNode } from "react";
import { ProgressBar } from "./ProgressBar";

interface StepLayoutProps {
  stepNumber: number;
  title: string;
  description: string;
  children: ReactNode;
  totalSteps?: number;
}

export function StepLayout({
  stepNumber,
  title,
  description,
  children,
  totalSteps = 10,
}: StepLayoutProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 pt-6 pb-4 border-b border-border md:hidden">
        <ProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
      </div>
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 animate-slide-in">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold glow-orange-sm">
              {stepNumber}
            </span>
            <h1 className="font-display text-2xl md:text-3xl text-foreground">{title}</h1>
          </div>
          <p className="text-muted-foreground text-sm mb-8 ml-11">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
