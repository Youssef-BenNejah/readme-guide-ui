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
  code: z.string().min(1).max(16),
  label: z.string().min(2).max(64),
  type: z.enum(["percent", "fixed"]),
  value: z.coerce.number().min(0),
  isActive: z.boolean(),
});

export function Step5TaxRate({ sessionState, setSessionState, onNext }: StepProps) {
  const [result, setResult] = useState<any>(null);
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { code: "", label: "", type: "percent" as const, value: 0, isActive: true },
  });

  const taxType = watch("type");

  const onSubmit = async (data: any) => {
    const res = await execute("POST", "/api/tax-rates", { ...data, restaurantId: sessionState.restaurantId });
    if (res) {
      setSessionState((prev) => ({ ...prev, taxRateId: res.id, taxRateLabel: data.label, taxRateValue: data.value }));
      setResult(res);
    }
  };

  if (result) {
    return (
      <StepLayout stepNumber={5} title="Configure a Tax Rate" description="Tax rate created.">
        <SuccessCard title="Tax Rate Created">
          <CopyableId label="Tax Rate ID" value={result.id} />
        </SuccessCard>
        <Button onClick={onNext} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
      </StepLayout>
    );
  }

  return (
    <StepLayout stepNumber={5} title="Configure a Tax Rate" description='Define the primary tax rate that will apply to your menu items (e.g. TVA 7%).'>
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Tax Code</Label>
            <Input {...register("code")} placeholder="TVA7" />
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Label</Label>
            <Input {...register("label")} placeholder="TVA 7%" />
            {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <div className="flex gap-4">
              {(["percent", "fixed"] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" value={t} {...register("type")} className="accent-primary" />
                  {t === "percent" ? "Percent (%)" : "Fixed (DT)"}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Value</Label>
            <div className="relative">
              <Input type="number" step="0.01" {...register("value")} className="pr-10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {taxType === "percent" ? "%" : "DT"}
              </span>
            </div>
            {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} className="accent-primary" id="isActive" />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Tax Rate
        </Button>
      </form>
    </StepLayout>
  );
}
