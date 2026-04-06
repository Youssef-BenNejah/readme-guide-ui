import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { StepLayout } from "@/components/layout/StepLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { SuccessCard } from "@/components/ui/SuccessCard";
import { CopyableId } from "@/components/ui/CopyableId";
import { useApi } from "@/hooks/useApi";
import type { StepProps } from "@/types/session";

interface Step1Props extends StepProps {
  onDashboard: () => void;
}

const schema = z.object({
  restaurantName: z.string().min(1, "Required"),
  tradeName: z.string().min(1, "Required").max(64),
  matriculeFiscal: z.string().regex(/^\d{7}[A-Z]$/, "7 digits + 1 uppercase letter, e.g. 1234567A"),
  establishmentRef: z.string().regex(/^\d{3}$/, "Must be 3 digits").optional().or(z.literal("")),
  address: z.string().min(8).max(128),
  city: z.string().min(3).max(32),
  deviceName: z.string().min(1, "Required"),
  serialNumber: z.string().min(1, "Required"),
  ownerName: z.string().min(1, "Required"),
  ownerPin: z.string().min(4).max(8),
});

type FormData = z.infer<typeof schema>;

export function Step1Setup({ sessionState, setSessionState, onNext, onDashboard }: Step1Props) {
  const [showPin, setShowPin] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { execute, loading, error } = useApi();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { establishmentRef: "000" },
  });

  const pinValue = watch("ownerPin");

  const onSubmit = async (data: FormData) => {
    const res = await execute("POST", "/api/admin/setup", {
      restaurantName: data.restaurantName,
      tradeName: data.tradeName,
      matriculeFiscal: data.matriculeFiscal,
      establishmentRef: data.establishmentRef || "000",
      address: data.address,
      city: data.city,
      deviceName: data.deviceName,
      serialNumber: data.serialNumber,
      ownerName: data.ownerName,
      ownerPin: data.ownerPin,
    });
    if (res) {
      setSessionState((prev) => ({
        ...prev,
        restaurantId: res.restaurantId || res.restaurant?.id,
        deviceId: res.deviceId || res.device?.id,
        ownerId: res.ownerId || res.owner?.id,
        ownerName: data.ownerName,
        restaurantName: data.restaurantName,
      }));
      setResult({ ...res, ownerPin: data.ownerPin });
    }
  };

  if (result) {
    return (
      <StepLayout stepNumber={1} title="Create Your Restaurant" description="Setup complete! Here are your details.">
        <SuccessCard title="Restaurant Created Successfully">
          <div className="space-y-2">
            <CopyableId label="Restaurant ID" value={result.restaurantId || result.restaurant?.id || "—"} />
            <CopyableId label="Device ID" value={result.deviceId || result.device?.id || "—"} />
            <CopyableId label="Owner ID" value={result.ownerId || result.owner?.id || "—"} />
          </div>
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-xs text-destructive font-semibold mb-1">⚠ Save this PIN — it will not be shown again</p>
            <p className="font-mono text-sm text-foreground">{result.ownerPin}</p>
          </div>
        </SuccessCard>
        <Button onClick={onNext} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Continue
        </Button>
      </StepLayout>
    );
  }

  return (
    <StepLayout stepNumber={1} title="Create Your Restaurant" description="This bootstraps your restaurant, your first device, and your owner account in a single call.">
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="restaurantName">Restaurant Name</Label>
            <Input id="restaurantName" {...register("restaurantName")} autoFocus />
            {errors.restaurantName && <p className="text-xs text-destructive">{errors.restaurantName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tradeName">Trade Name</Label>
            <Input id="tradeName" {...register("tradeName")} />
            {errors.tradeName && <p className="text-xs text-destructive">{errors.tradeName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="matriculeFiscal">Matricule Fiscal</Label>
            <Input id="matriculeFiscal" {...register("matriculeFiscal")} placeholder="1234567A" />
            <p className="text-[11px] text-muted-foreground/70">7 digits followed by 1 uppercase letter</p>
            {errors.matriculeFiscal && <p className="text-xs text-destructive">{errors.matriculeFiscal.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="establishmentRef">Establishment Ref</Label>
            <Input id="establishmentRef" {...register("establishmentRef")} placeholder="000" />
            {errors.establishmentRef && <p className="text-xs text-destructive">{errors.establishmentRef.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="deviceName">Device Name</Label>
            <Input id="deviceName" {...register("deviceName")} placeholder="Main Cash Register" />
            {errors.deviceName && <p className="text-xs text-destructive">{errors.deviceName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input id="serialNumber" {...register("serialNumber")} placeholder="CR-TUNIS-0001" />
            {errors.serialNumber && <p className="text-xs text-destructive">{errors.serialNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input id="ownerName" {...register("ownerName")} />
            {errors.ownerName && <p className="text-xs text-destructive">{errors.ownerName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ownerPin">Owner PIN</Label>
            <div className="relative">
              <Input
                id="ownerPin"
                type={showPin ? "text" : "password"}
                {...register("ownerPin")}
                className="pr-16"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{pinValue?.length || 0}/8</span>
                <button type="button" onClick={() => setShowPin(!showPin)} className="p-1 text-muted-foreground hover:text-foreground">
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            {errors.ownerPin && <p className="text-xs text-destructive">{errors.ownerPin.message}</p>}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Restaurant
        </Button>
      </form>
    </StepLayout>
  );
}
