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
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import type { StepProps } from "@/types/session";

const schema = z.object({
  currentPin: z.string().min(1, "Required"),
  newPin: z.string().min(4).max(8),
  confirmPin: z.string().min(4).max(8),
}).refine((d) => d.newPin === d.confirmPin, { message: "PINs do not match", path: ["confirmPin"] });

export function Step3ChangePin({ sessionState, onNext }: StepProps) {
  const [showPins, setShowPins] = useState({ current: false, new: false, confirm: false });
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const res = await execute(
      "PUT",
      `/api/staff/${sessionState.ownerId}/pin?restaurantId=${sessionState.restaurantId}`,
      { currentPin: data.currentPin, newPin: data.newPin }
    );
    if (res !== null) {
      toast.success("PIN updated successfully");
      onNext();
    }
  };

  const toggleShow = (field: "current" | "new" | "confirm") =>
    setShowPins((p) => ({ ...p, [field]: !p[field] }));

  return (
    <StepLayout stepNumber={3} title="Change Your PIN" description="Secure your account by setting a new PIN.">
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {(["current", "new", "confirm"] as const).map((field) => {
          const label = field === "current" ? "Current PIN" : field === "new" ? "New PIN" : "Confirm New PIN";
          const name = field === "current" ? "currentPin" : field === "new" ? "newPin" : "confirmPin";
          return (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={name}>{label}</Label>
              <div className="relative">
                <Input id={name} type={showPins[field] ? "text" : "password"} {...register(name as any)} className="pr-10" />
                <button type="button" onClick={() => toggleShow(field)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPins[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {(errors as any)[name] && <p className="text-xs text-destructive">{(errors as any)[name]?.message}</p>}
            </div>
          );
        })}
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Update PIN
        </Button>
      </form>
    </StepLayout>
  );
}
