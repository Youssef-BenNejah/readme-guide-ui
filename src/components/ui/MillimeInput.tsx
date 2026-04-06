import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MillimeInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
}

export function MillimeInput({ label, value, onChange, required, error }: MillimeInputProps) {
  const millimes = value ? Math.round(parseFloat(value) * 1000) : 0;

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="number"
          step="0.001"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.000"
          required={required}
          className="pr-12"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">DT</span>
      </div>
      {value && parseFloat(value) > 0 && (
        <p className="text-xs text-muted-foreground font-mono">
          = {millimes.toLocaleString()} millimes
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-[11px] text-muted-foreground/70">Enter price in DT — e.g. 0.500 for 500 millimes</p>
    </div>
  );
}
