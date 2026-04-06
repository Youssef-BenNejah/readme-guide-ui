import { useState, useRef } from "react";
import { Upload, FileJson, Check, AlertCircle, X } from "lucide-react";
import { StepLayout } from "@/components/layout/StepLayout";
import { Button } from "@/components/ui/button";
import type { SessionState, MenuItem } from "@/types/session";

interface Step3ImportMenuProps {
  sessionState: SessionState;
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>;
  onNext: (items: MenuItem[]) => void;
}

export function Step3ImportMenu({ sessionState, setSessionState, onNext }: Step3ImportMenuProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const parsed: MenuItem[] = [];

        const arr = Array.isArray(data) ? data : data.items || data.menuItems || data.menu || [];
        if (!Array.isArray(arr) || arr.length === 0) {
          setError("JSON must contain an array of menu items (or an object with an 'items'/'menuItems'/'menu' key).");
          return;
        }

        for (const item of arr) {
          parsed.push({
            name: item.name || "Unnamed Item",
            price: Number(item.price) || 0,
            family: item.family || null,
            category: item.category || null,
            modifierGroup: item.modifierGroup || null,
          });
        }

        setItems(parsed);
      } catch {
        setError("Invalid JSON file. Please check the format and try again.");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setItems([]);
    setFileName(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <StepLayout
      stepNumber={5}
      title="Import Restaurant Menu"
      description="Upload a JSON file with your menu items. Items will use the product family and tax rate you configured."
      totalSteps={6}
    >
      <div className="space-y-6">
        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors bg-card"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Drop your JSON file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">Accepts .json files</p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* File loaded */}
        {fileName && items.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{fileName}</span>
                <span className="text-xs text-muted-foreground">({items.length} items)</span>
              </div>
              <button onClick={clearFile} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/50 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-border">
                {items.slice(0, 20).map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-mono text-primary">{item.price.toFixed(3)} DT</span>
                  </div>
                ))}
                {items.length > 20 && (
                  <div className="px-4 py-2.5 text-center text-xs text-muted-foreground">
                    +{items.length - 20} more items…
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* JSON format hint */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Expected JSON format:</p>
          <pre className="text-xs font-mono text-muted-foreground overflow-auto">
{`[
  { "name": "Margherita Pizza", "price": 12.500, "category": "Pizza" },
  { "name": "Caesar Salad", "price": 8.000, "category": "Salads" }
]`}
          </pre>
        </div>

        <Button
          onClick={() => onNext(items)}
          disabled={items.length === 0}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Import {items.length} Item{items.length !== 1 ? "s" : ""} & Continue
        </Button>
      </div>
    </StepLayout>
  );
}
