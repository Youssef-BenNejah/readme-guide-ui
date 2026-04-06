import { SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SkipButtonProps {
  onClick: () => void;
  label?: string;
}

export function SkipButton({ onClick, label = "Skip this step" }: SkipButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="gap-2 border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
    >
      <SkipForward className="w-4 h-4" />
      {label}
    </Button>
  );
}
