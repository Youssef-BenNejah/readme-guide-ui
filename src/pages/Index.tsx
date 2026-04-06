import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { StepSidebar } from "@/components/layout/StepSidebar";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { Step1Setup } from "@/steps/Step1Setup";
import { Step2Login } from "@/steps/Step2Login";
import { Step3TaxRate } from "@/steps/Step3TaxRate";
import { Step4ProductFamily } from "@/steps/Step4ProductFamily";
import { Step3ImportMenu } from "@/steps/Step3ImportMenu";
import { StepComplete } from "@/steps/StepComplete";
import Dashboard from "@/pages/Dashboard";
import { initialSessionState } from "@/types/session";
import { Button } from "@/components/ui/button";
import type { SessionState, Restaurant, MenuItem } from "@/types/session";

const TOTAL_STEPS = 3;

const Index = () => {
  const [view, setView] = useState<"dashboard" | "onboarding">("dashboard");
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionState, setSessionState] = useState<SessionState>(initialSessionState);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [importedItems, setImportedItems] = useState<MenuItem[]>([]);

  const markComplete = (step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  };

  const goTo = (step: number) => {
    markComplete(currentStep);
    setCurrentStep(step);
  };

  const startOnboarding = () => {
    setSessionState(initialSessionState);
    setCompletedSteps(new Set());
    setImportedItems([]);
    setCurrentStep(1);
    setView("onboarding");
  };

  const backToDashboard = () => {
    setView("dashboard");
  };

  const handleImport = (items: MenuItem[]) => {
    setImportedItems(items);
    goTo(4);
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
      menuItems: importedItems,
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
      case 3: return <Step3ImportMenu {...props} onNext={handleImport} />;
      case 4: return <StepComplete sessionState={sessionState} importedItems={importedItems} onDashboard={finishOnboarding} />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <StepSidebar currentStep={currentStep > 3 ? 3 : currentStep} completedSteps={completedSteps} />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex items-center gap-4 px-6 pt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={backToDashboard}
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
          <div className="flex-1 hidden md:block">
            <ProgressBar currentStep={currentStep > 3 ? 4 : currentStep} totalSteps={TOTAL_STEPS + 1} />
          </div>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default Index;
