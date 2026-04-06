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
  name: z.string().min(3).max(128),
  displayOrder: z.coerce.number().optional(),
  icon: z.string().optional(),
  isActive: z.boolean(),
});

export function Step7MenuCategory({ sessionState, setSessionState, onNext }: StepProps) {
  const [result, setResult] = useState<any>(null);
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", displayOrder: 1, icon: "", isActive: true },
  });

  const onSubmit = async (data: any) => {
    const res = await execute("POST", "/api/menu/categories", { ...data, restaurantId: sessionState.restaurantId });
    if (res) {
      setSessionState((prev) => ({ ...prev, categoryId: res.id, categoryName: data.name }));
      setResult(res);
    }
  };

  if (result) {
    return (
      <StepLayout stepNumber={7} title="Create a Menu Category" description="Category created.">
        <SuccessCard title="Menu Category Created">
          <CopyableId label="Category ID" value={result.id} />
        </SuccessCard>
        <Button onClick={onNext} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
      </StepLayout>
    );
  }

  return (
    <StepLayout stepNumber={7} title="Create a Menu Category" description="Categories organize items on your POS menu (e.g. Hot Drinks, Sandwiches).">
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Category Name</Label>
          <Input {...register("name")} autoFocus />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Display Order</Label>
            <Input type="number" {...register("displayOrder")} />
          </div>
          <div className="space-y-1.5">
            <Label>Icon Name</Label>
            <Input {...register("icon")} placeholder="coffee" />
            <p className="text-[11px] text-muted-foreground/70">Use any Lucide icon name</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} className="accent-primary" id="catActive" />
          <Label htmlFor="catActive">Active</Label>
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Category
        </Button>
      </form>
    </StepLayout>
  );
}
