import { useState, useMemo } from "react";
import { StepSidebar } from "@/components/layout/StepSidebar";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { Step1Setup } from "@/steps/Step1Setup";
import { Step2Login } from "@/steps/Step2Login";
import { Step3ChangePin } from "@/steps/Step3ChangePin";
import { Step4RestaurantProfile } from "@/steps/Step4RestaurantProfile";
import { Step5TaxRate } from "@/steps/Step5TaxRate";
import { Step6ProductFamily } from "@/steps/Step6ProductFamily";
import { Step7MenuCategory } from "@/steps/Step7MenuCategory";
import { Step8ModifierGroup } from "@/steps/Step8ModifierGroup";
import { Step9Modifiers } from "@/steps/Step9Modifiers";
import { Step10MenuItem } from "@/steps/Step10MenuItem";
import { StepComplete } from "@/steps/StepComplete";
import Dashboard from "@/pages/Dashboard";
import { initialSessionState } from "@/types/session";
import type { SessionState } from "@/types/session";

const TOTAL_STEPS = 10;

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionState, setSessionState] = useState<SessionState>(initialSessionState);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const markComplete = (step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  };

  const goTo = (step: number) => {
    markComplete(currentStep);
    setCurrentStep(step);
  };

  const handleSkip8 = () => {
    setSessionState((prev) => ({ ...prev, skippedStep8: true }));
    markComplete(8);
    markComplete(9);
    setCurrentStep(10);
  };

  const renderStep = () => {
    const props = { sessionState, setSessionState };

    switch (currentStep) {
      case 1: return <Step1Setup {...props} onNext={() => goTo(2)} onDashboard={() => setCurrentStep(12)} />;
      case 2: return <Step2Login {...props} onNext={() => goTo(3)} />;
      case 3: return <Step3ChangePin {...props} onNext={() => goTo(4)} />;
      case 4: return <Step4RestaurantProfile {...props} onNext={() => goTo(5)} onSkip={() => { markComplete(4); setCurrentStep(5); }} />;
      case 5: return <Step5TaxRate {...props} onNext={() => goTo(6)} />;
      case 6: return <Step6ProductFamily {...props} onNext={() => goTo(7)} />;
      case 7: return <Step7MenuCategory {...props} onNext={() => goTo(8)} />;
      case 8: return <Step8ModifierGroup {...props} onNext={() => goTo(9)} onSkip={handleSkip8} />;
      case 9: return <Step9Modifiers {...props} onNext={() => goTo(10)} onSkip={() => { markComplete(9); setCurrentStep(10); }} />;
      case 10: return <Step10MenuItem {...props} onNext={() => { markComplete(10); setCurrentStep(11); }} />;
      case 11: return <StepComplete sessionState={sessionState} onAddAnother={() => setCurrentStep(10)} onDashboard={() => setCurrentStep(12)} />;
      case 12: return <Dashboard sessionState={sessionState} onBack={() => setCurrentStep(11)} />;
      default: return null;
    }
  };

  if (currentStep === 12) {
    return renderStep();
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StepSidebar currentStep={currentStep > 10 ? 10 : currentStep} completedSteps={completedSteps} />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="hidden md:block px-6 pt-6">
          <ProgressBar currentStep={currentStep > 10 ? 11 : currentStep} totalSteps={TOTAL_STEPS + 1} />
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default Index;
