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
  code: z.string().min(2).max(8),
  name: z.string().min(3).max(128),
});

export function Step6ProductFamily({ sessionState, setSessionState, onNext }: StepProps) {
  const [result, setResult] = useState<any>(null);
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { code: "", name: "" },
  });

  const onSubmit = async (data: any) => {
    const body: any = { ...data, restaurantId: sessionState.restaurantId };
    if (sessionState.taxRateId) body.defaultTaxId = sessionState.taxRateId;
    const res = await execute("POST", "/api/families", body);
    if (res) {
      setSessionState((prev) => ({ ...prev, familyId: res.id, familyName: data.name }));
      setResult(res);
    }
  };

  if (result) {
    return (
      <StepLayout stepNumber={6} title="Create a Product Family" description="Family created.">
        <SuccessCard title="Product Family Created">
          <CopyableId label="Family ID" value={result.id} />
        </SuccessCard>
        <Button onClick={onNext} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
      </StepLayout>
    );
  }

  return (
    <StepLayout stepNumber={6} title="Create a Product Family" description="Families group products for reporting and tax assignment.">
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Family Code</Label>
          <Input {...register("code")} placeholder="01" autoFocus />
          {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Family Name</Label>
          <Input {...register("name")} placeholder="All Products" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        {sessionState.taxRateId && (
          <p className="text-xs text-muted-foreground">Default tax: <span className="text-foreground">{sessionState.taxRateLabel || sessionState.taxRateId}</span> (from Step 5)</p>
        )}
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Family
        </Button>
      </form>
    </StepLayout>
  );
}
