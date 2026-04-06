import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { StepLayout } from "@/components/layout/StepLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { SkipButton } from "@/components/ui/SkipButton";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import type { StepProps } from "@/types/session";

interface Modifier {
  id: string;
  name: string;
  priceHtDelta: number;
}

export function Step9Modifiers({ sessionState, onNext, onSkip }: StepProps) {
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [name, setName] = useState("");
  const [priceDt, setPriceDt] = useState("0");
  const { execute, loading, error } = useApi(sessionState.accessToken);

  const addModifier = async () => {
    if (!name || name.length < 3) return;
    const priceHtDelta = Math.round(parseFloat(priceDt || "0") * 1000);
    const res = await execute("POST", "/api/menu/modifiers", {
      groupId: sessionState.modifierGroupId,
      name,
      priceHtDelta,
    });
    if (res) {
      setModifiers((prev) => [...prev, { id: res.id, name, priceHtDelta: parseFloat(priceDt || "0") }]);
      setName("");
      setPriceDt("0");
      toast.success(`Modifier "${name}" added`);
    }
  };

  return (
    <StepLayout stepNumber={9} title="Add Modifiers" description="Add individual options to your modifier group (e.g. 'Extra Milk', 'No Sugar').">
      {error && <ApiErrorBanner message={error} />}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Modifier Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Extra Milk" autoFocus />
        </div>
        <div className="space-y-1.5">
          <Label>Price Delta (DT)</Label>
          <Input type="number" step="0.001" value={priceDt} onChange={(e) => setPriceDt(e.target.value)} />
          <p className="text-[11px] text-muted-foreground/70">Enter price in DT — e.g. 0.500 for 500 millimes</p>
        </div>
        <Button onClick={addModifier} disabled={loading || name.length < 3 || modifiers.length >= 10} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Add Modifier ({modifiers.length}/10)
        </Button>

        {modifiers.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {modifiers.map((m) => (
              <Badge key={m.id} variant="secondary" className="text-sm py-1.5 px-3">
                {m.name} {m.priceHtDelta > 0 && `(+${m.priceHtDelta.toFixed(3)} DT)`}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {modifiers.length > 0 && (
            <Button onClick={onNext} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Done, Continue
            </Button>
          )}
          {onSkip && <SkipButton onClick={onSkip} />}
        </div>
      </div>
    </StepLayout>
  );
}
