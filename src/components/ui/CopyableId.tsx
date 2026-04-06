import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyableIdProps {
  label: string;
  value: string;
}

export function CopyableId({ label, value }: CopyableIdProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted rounded-md">
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="font-mono text-sm text-foreground truncate">{value}</span>
      </div>
      <button
        onClick={handleCopy}
        className="shrink-0 p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
