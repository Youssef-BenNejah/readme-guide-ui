import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { StepLayout } from "@/components/layout/StepLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { MillimeInput } from "@/components/ui/MillimeInput";
import { useApi } from "@/hooks/useApi";
import type { StepProps } from "@/types/session";

const schema = z.object({
  name: z.string().min(3).max(64),
  description: z.string().optional(),
  priceHt: z.string().min(1),
  prepTimeMin: z.coerce.number().optional(),
  station: z.enum(["kitchen", "bar", "pastry"]),
  imagePath: z.string().optional(),
  isAvailable: z.boolean(),
  displayOrder: z.coerce.number().optional(),
});

export function Step10MenuItem({ sessionState, setSessionState, onNext }: StepProps) {
  const [result, setResult] = useState<any>(null);
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      priceHt: "",
      prepTimeMin: undefined,
      station: "kitchen" as const,
      imagePath: "",
      isAvailable: true,
      displayOrder: 0,
    },
  });

  const priceHt = watch("priceHt");

  const onSubmit = async (data: any) => {
    const millimes = Math.round(parseFloat(data.priceHt) * 1000);
    const body: any = {
      restaurantId: sessionState.restaurantId,
      categoryId: sessionState.categoryId,
      familyId: sessionState.familyId,
      taxRateId: sessionState.taxRateId,
      name: data.name,
      description: data.description || undefined,
      priceHt: millimes,
      prepTimeMin: data.prepTimeMin || undefined,
      station: data.station,
      imagePath: data.imagePath || undefined,
      isAvailable: data.isAvailable,
      displayOrder: data.displayOrder || 0,
    };
    if (sessionState.modifierGroupId) {
      body.modifierGroupIds = [sessionState.modifierGroupId];
    }
    const res = await execute("POST", "/api/menu/items", body);
    if (res) {
      setSessionState((prev) => ({ ...prev, menuItemName: data.name, menuItemPrice: parseFloat(data.priceHt) }));
      setResult(res);
    }
  };

  if (result) {
    onNext();
    return null;
  }

  return (
    <StepLayout stepNumber={10} title="Create Your First Menu Item" description="Add a product to your menu with pricing, category, tax, and optional modifiers.">
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Item Name</Label>
          <Input {...register("name")} autoFocus />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea {...register("description")} rows={2} />
        </div>
        <MillimeInput
          label="Price HT (DT)"
          value={priceHt}
          onChange={(v) => setValue("priceHt", v)}
          required
          error={errors.priceHt?.message}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Prep Time (min)</Label>
            <Input type="number" {...register("prepTimeMin")} />
          </div>
          <div className="space-y-1.5">
            <Label>Station</Label>
            <select {...register("station")} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground">
              <option value="kitchen">Kitchen</option>
              <option value="bar">Bar</option>
              <option value="pastry">Pastry</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Image Path</Label>
          <Input {...register("imagePath")} placeholder="images/menu/cappuccino.png" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isAvailable")} className="accent-primary" id="avail" />
            <Label htmlFor="avail">Available</Label>
          </div>
          <div className="space-y-1.5">
            <Label>Display Order</Label>
            <Input type="number" {...register("displayOrder")} />
          </div>
        </div>
        {sessionState.categoryId && <p className="text-xs text-muted-foreground">Category: <span className="text-foreground">{sessionState.categoryName || sessionState.categoryId}</span></p>}
        {sessionState.familyId && <p className="text-xs text-muted-foreground">Family: <span className="text-foreground">{sessionState.familyName || sessionState.familyId}</span></p>}
        {sessionState.modifierGroupId && <p className="text-xs text-muted-foreground">Modifier Group: <span className="text-foreground">{sessionState.modifierGroupName || sessionState.modifierGroupId}</span></p>}
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Menu Item
        </Button>
      </form>
    </StepLayout>
  );
}
