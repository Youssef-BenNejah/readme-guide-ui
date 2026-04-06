import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { StepLayout } from "@/components/layout/StepLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { SkipButton } from "@/components/ui/SkipButton";
import { SuccessCard } from "@/components/ui/SuccessCard";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { useState } from "react";
import type { StepProps } from "@/types/session";

export function Step4RestaurantProfile({ sessionState, setSessionState, onNext, onSkip }: StepProps) {
  const [done, setDone] = useState(false);
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: sessionState.restaurantName || "",
      tradeName: "",
      matriculeFiscal: "",
      establishmentRef: "000",
      activityCode: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      logoPath: "",
      timezone: "Africa/Tunis",
      currency: "TND",
    },
  });

  const onSubmit = async (data: any) => {
    const res = await execute("PUT", `/api/restaurants/${sessionState.restaurantId}`, data);
    if (res) {
      toast.success("Profile updated");
      setDone(true);
    }
  };

  if (done) {
    return (
      <StepLayout stepNumber={4} title="Complete Your Restaurant Profile" description="Profile updated.">
        <SuccessCard title="Profile Saved">
          <p className="text-sm text-muted-foreground">Your restaurant profile has been updated.</p>
        </SuccessCard>
        <Button onClick={onNext} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
      </StepLayout>
    );
  }

  return (
    <StepLayout stepNumber={4} title="Complete Your Restaurant Profile" description="Add contact info, fiscal details, and branding. You can skip this and update later.">
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Restaurant Name</Label><Input {...register("name")} /></div>
          <div className="space-y-1.5"><Label>Trade Name</Label><Input {...register("tradeName")} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Matricule Fiscal</Label><Input {...register("matriculeFiscal")} placeholder="1234567A" /></div>
          <div className="space-y-1.5"><Label>Establishment Ref</Label><Input {...register("establishmentRef")} /></div>
        </div>
        <div className="space-y-1.5"><Label>Activity Code</Label><Input {...register("activityCode")} placeholder="4401" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Address</Label><Input {...register("address")} /></div>
          <div className="space-y-1.5"><Label>City</Label><Input {...register("city")} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Phone</Label><Input {...register("phone")} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" {...register("email")} /></div>
        </div>
        <div className="space-y-1.5"><Label>Logo Path</Label><Input {...register("logoPath")} placeholder="images/logo.png" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <select {...register("timezone")} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground">
              <option value="Africa/Tunis">Africa/Tunis</option>
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <select {...register("currency")} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground">
              <option value="TND">TND</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button type="submit" disabled={loading} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Profile
          </Button>
          {onSkip && <SkipButton onClick={onSkip} />}
        </div>
      </form>
    </StepLayout>
  );
}
