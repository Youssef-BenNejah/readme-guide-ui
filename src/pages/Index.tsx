import { useState } from "react";
import { StepSidebar } from "@/components/layout/StepSidebar";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { Step1Setup } from "@/steps/Step1Setup";
import { Step2Login } from "@/steps/Step2Login";
import { Step6ProductFamily } from "@/steps/Step6ProductFamily";
import { Step7MenuCategory } from "@/steps/Step7MenuCategory";
import { Step8ModifierGroup } from "@/steps/Step8ModifierGroup";
import { Step9Modifiers } from "@/steps/Step9Modifiers";
import { Step10MenuItem } from "@/steps/Step10MenuItem";
import { StepComplete } from "@/steps/StepComplete";
import Dashboard from "@/pages/Dashboard";
import { initialSessionState } from "@/types/session";
import type { SessionState, Restaurant } from "@/types/session";

const TOTAL_STEPS = 7;

const Index = () => {
  const [view, setView] = useState<"dashboard" | "onboarding">("dashboard");
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionState, setSessionState] = useState<SessionState>(initialSessionState);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const markComplete = (step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  };

  const goTo = (step: number) => {
    markComplete(currentStep);
    setCurrentStep(step);
  };

  const handleSkip5 = () => {
    setSessionState((prev) => ({ ...prev, skippedStep8: true }));
    markComplete(5);
    markComplete(6);
    setCurrentStep(7);
  };

  const startOnboarding = () => {
    setSessionState(initialSessionState);
    setCompletedSteps(new Set());
    setCurrentStep(1);
    setView("onboarding");
  };

  const finishOnboarding = () => {
    const s = sessionState;
    const newRestaurant: Restaurant = {
      id: s.restaurantId || crypto.randomUUID(),
      name: s.restaurantName || "Unnamed Restaurant",
      owner: s.ownerName || "Owner",
      deviceId: s.deviceId || crypto.randomUUID(),
      taxRate: s.taxRateLabel,
      taxRateValue: s.taxRateValue,
      family: s.familyName,
      category: s.categoryName,
      modifierGroup: s.modifierGroupName,
      menuItems: s.menuItemName
        ? [{ name: s.menuItemName, price: s.menuItemPrice || 0, family: s.familyName, category: s.categoryName, modifierGroup: s.modifierGroupName }]
        : [],
      createdAt: new Date().toISOString(),
    };
    setRestaurants((prev) => [...prev, newRestaurant]);
    setSelectedRestaurantId(newRestaurant.id);
    setView("dashboard");
  };

  const handleDeleteRestaurant = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    if (selectedRestaurantId === id) setSelectedRestaurantId(null);
  };

  if (view === "dashboard") {
    return (
      <Dashboard
        restaurants={restaurants}
        onAddNew={startOnboarding}
        onDelete={handleDeleteRestaurant}
        onSelect={setSelectedRestaurantId}
        selectedId={selectedRestaurantId}
      />
    );
  }

  const props = { sessionState, setSessionState };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Setup {...props} onNext={() => goTo(2)} />;
      case 2: return <Step2Login {...props} onNext={() => goTo(3)} />;
      case 3: return <Step6ProductFamily {...props} onNext={() => goTo(4)} />;
      case 4: return <Step7MenuCategory {...props} onNext={() => goTo(5)} />;
      case 5: return <Step8ModifierGroup {...props} onNext={() => goTo(6)} onSkip={handleSkip5} />;
      case 6: return <Step9Modifiers {...props} onNext={() => goTo(7)} onSkip={() => { markComplete(6); setCurrentStep(7); }} />;
      case 7: return <Step10MenuItem {...props} onNext={() => { markComplete(7); setCurrentStep(8); }} />;
      case 8: return <StepComplete sessionState={sessionState} onAddAnother={() => setCurrentStep(7)} onDashboard={finishOnboarding} />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <StepSidebar currentStep={currentStep > 7 ? 7 : currentStep} completedSteps={completedSteps} />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="hidden md:block px-6 pt-6">
          <ProgressBar currentStep={currentStep > 7 ? 8 : currentStep} totalSteps={TOTAL_STEPS + 1} />
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default Index;
