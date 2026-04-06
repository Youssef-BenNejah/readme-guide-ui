import { AlertTriangle } from "lucide-react";

interface ApiErrorBannerProps {
  message: string;
}

export function ApiErrorBanner({ message }: ApiErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 mb-6 animate-fade-in">
      <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}
