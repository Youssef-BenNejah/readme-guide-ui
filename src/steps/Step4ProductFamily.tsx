import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { StepLayout } from "@/components/layout/StepLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { SuccessCard } from "@/components/ui/SuccessCard";
import { CopyableId } from "@/components/ui/CopyableId";
import { useApi } from "@/hooks/useApi";
import type { StepProps } from "@/types/session";

const schema = z.object({
  name: z.string().min(1, "Required").max(64),
});

export function Step4ProductFamily({ sessionState, setSessionState, onNext }: StepProps) {
  const [result, setResult] = useState<any>(null);
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "Food" },
  });

  const onSubmit = async (data: any) => {
    const res = await execute("POST", "/api/families", {
      restaurantId: sessionState.restaurantId,
      name: data.name,
      defaultTaxRateId: sessionState.taxRateId,
    });
    if (res) {
      setSessionState((prev) => ({
        ...prev,
        familyId: res.id,
        familyName: data.name,
      }));
      setResult(res);
    }
  };

  if (result) {
    return (
      <StepLayout stepNumber={4} title="Create Product Family" description="Family created with default tax rate.">
        <SuccessCard title="Product Family Created">
          <CopyableId label="Family ID" value={result.id} />
          <p className="text-sm text-muted-foreground mt-2">
            Name: <span className="text-foreground font-medium">{sessionState.familyName}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Default Tax: <span className="text-foreground font-medium">{sessionState.taxRateLabel} ({sessionState.taxRateValue}%)</span>
          </p>
        </SuccessCard>
        <Button onClick={onNext} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
      </StepLayout>
    );
  }

  return (
    <StepLayout stepNumber={4} title="Create Product Family" description="Create a product family with the configured default tax rate. Menu items will inherit this tax.">
      {error && <ApiErrorBanner message={error} />}
      <div className="p-3 mb-2 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-xs text-primary font-medium">
          Default Tax: {sessionState.taxRateLabel || "—"} ({sessionState.taxRateValue ?? 0}%)
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Family Name</Label>
          <Input id="name" {...register("name")} placeholder="Food" autoFocus />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Family
        </Button>
      </form>
    </StepLayout>
  );
}
