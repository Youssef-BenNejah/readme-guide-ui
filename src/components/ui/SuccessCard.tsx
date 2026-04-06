import { CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";

interface SuccessCardProps {
  title: string;
  children: ReactNode;
}

export function SuccessCard({ title, children }: SuccessCardProps) {
  return (
    <div className="p-5 rounded-xl bg-success/5 border border-success/20 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-5 h-5 text-success" />
        <h3 className="font-semibold text-success text-sm">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
