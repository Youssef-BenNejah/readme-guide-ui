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
  label: z.string().min(1, "Required").max(32),
  rate: z.coerce.number().min(0).max(100),
});

export function Step3TaxRate({ sessionState, setSessionState, onNext }: StepProps) {
  const [result, setResult] = useState<any>(null);
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { label: "TVA 19%", rate: 19 },
  });

  const onSubmit = async (data: any) => {
    const res = await execute("POST", "/api/tax-rates", {
      restaurantId: sessionState.restaurantId,
      label: data.label,
      rate: data.rate,
    });
    if (res) {
      setSessionState((prev) => ({
        ...prev,
        taxRateId: res.id,
        taxRateLabel: data.label,
        taxRateValue: data.rate,
      }));
      setResult(res);
    }
  };

  if (result) {
    return (
      <StepLayout stepNumber={3} title="Configure Tax Rate" description="Tax rate created successfully.">
        <SuccessCard title="Tax Rate Created">
          <CopyableId label="Tax Rate ID" value={result.id} />
          <p className="text-sm text-muted-foreground mt-2">
            Label: <span className="text-foreground font-medium">{sessionState.taxRateLabel}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Rate: <span className="text-foreground font-medium">{sessionState.taxRateValue}%</span>
          </p>
        </SuccessCard>
        <Button onClick={onNext} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
      </StepLayout>
    );
  }

  return (
    <StepLayout stepNumber={3} title="Configure Tax Rate" description="Set up a default tax rate for your restaurant. This will be applied to product families.">
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="label">Tax Label</Label>
          <Input id="label" {...register("label")} placeholder="TVA 19%" autoFocus />
          {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rate">Rate (%)</Label>
          <Input id="rate" type="number" step="0.01" {...register("rate")} placeholder="19" />
          {errors.rate && <p className="text-xs text-destructive">{errors.rate.message}</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Tax Rate
        </Button>
      </form>
    </StepLayout>
  );
}
