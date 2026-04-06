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
import { SkipButton } from "@/components/ui/SkipButton";
import { useApi } from "@/hooks/useApi";
import type { StepProps } from "@/types/session";

const schema = z.object({
  name: z.string().min(3).max(128),
  minSelections: z.coerce.number().min(0),
  maxSelections: z.coerce.number().min(1),
}).refine((d) => d.maxSelections >= d.minSelections, {
  message: "Max must be >= Min",
  path: ["maxSelections"],
});

export function Step8ModifierGroup({ sessionState, setSessionState, onNext, onSkip }: StepProps) {
  const [result, setResult] = useState<any>(null);
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", minSelections: 0, maxSelections: 1 },
  });

  const onSubmit = async (data: any) => {
    const res = await execute("POST", "/api/menu/modifier-groups", { ...data, restaurantId: sessionState.restaurantId });
    if (res) {
      setSessionState((prev) => ({ ...prev, modifierGroupId: res.id, modifierGroupName: data.name }));
      setResult(res);
    }
  };

  if (result) {
    return (
      <StepLayout stepNumber={8} title="Create a Modifier Group" description="Group created.">
        <SuccessCard title="Modifier Group Created">
          <CopyableId label="Modifier Group ID" value={result.id} />
        </SuccessCard>
        <Button onClick={onNext} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
      </StepLayout>
    );
  }

  return (
    <StepLayout stepNumber={8} title="Create a Modifier Group" description="Modifier groups let customers customize items (e.g. Sugar Level, Milk Type). Skip if not needed.">
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Group Name</Label>
          <Input {...register("name")} autoFocus />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Min Selections</Label>
            <Input type="number" {...register("minSelections")} />
          </div>
          <div className="space-y-1.5">
            <Label>Max Selections</Label>
            <Input type="number" {...register("maxSelections")} />
            {errors.maxSelections && <p className="text-xs text-destructive">{errors.maxSelections.message}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Group
          </Button>
          {onSkip && <SkipButton onClick={onSkip} />}
        </div>
      </form>
    </StepLayout>
  );
}
