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
import { useApi } from "@/hooks/useApi";
import type { StepProps } from "@/types/session";

const schema = z.object({
  pin: z.string().min(4).max(8),
  deviceId: z.string().min(1, "Required"),
});

export function Step2Login({ sessionState, setSessionState, onNext }: StepProps) {
  const [showPin, setShowPin] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { execute, loading, error } = useApi();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { pin: "", deviceId: sessionState.deviceId || "" },
  });

  const onSubmit = async (data: any) => {
    const res = await execute("POST", "/api/auth/pin-login", data);
    if (res) {
      setSessionState((prev) => ({
        ...prev,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      }));
      setResult(res);
    }
  };

  if (result) {
    return (
      <StepLayout stepNumber={2} title="Authenticate as Owner" description="Authentication successful.">
        {result.mustChangePin && (
          <div className="p-3 mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400 font-medium">⚠ You must change your PIN before continuing.</p>
          </div>
        )}
        <SuccessCard title="Logged In">
          <p className="text-sm text-muted-foreground">Staff: <span className="text-foreground">{result.staffName || "Owner"}</span></p>
          <p className="text-sm text-muted-foreground">Role: <span className="text-foreground">{result.role || "OWNER"}</span></p>
        </SuccessCard>
        <Button onClick={onNext} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
      </StepLayout>
    );
  }

  return (
    <StepLayout stepNumber={2} title="Authenticate as Owner" description="Use your PIN and device ID to get an access token for all subsequent API calls.">
      {error && <ApiErrorBanner message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="pin">PIN</Label>
          <div className="relative">
            <Input id="pin" type={showPin ? "text" : "password"} {...register("pin")} autoFocus className="pr-10" />
            <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.pin && <p className="text-xs text-destructive">{errors.pin.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="deviceId">Device ID</Label>
          <Input id="deviceId" {...register("deviceId")} />
          {errors.deviceId && <p className="text-xs text-destructive">{errors.deviceId.message}</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Login
        </Button>
      </form>
    </StepLayout>
  );
}
