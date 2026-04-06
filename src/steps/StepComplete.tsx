import { useState } from "react";
import { PartyPopper } from "lucide-react";
import { CopyableId } from "@/components/ui/CopyableId";
import { Button } from "@/components/ui/button";
import type { SessionState, MenuItem } from "@/types/session";

interface StepCompleteProps {
  sessionState: SessionState;
  importedItems?: MenuItem[];
  onDashboard: () => void;
}

export function StepComplete({ sessionState, importedItems = [], onDashboard }: StepCompleteProps) {
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 glow-orange">
          <PartyPopper className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">Your restaurant is ready.</h1>
        <p className="text-muted-foreground mb-8">Everything is set up and ready to go. 🎉</p>

        <div className="text-left space-y-3 mb-8 p-5 rounded-xl border border-border bg-card">
          <h3 className="font-semibold text-sm text-foreground mb-3">Setup Summary</h3>
          {sessionState.restaurantName && <p className="text-sm text-muted-foreground">Restaurant: <span className="text-foreground">{sessionState.restaurantName}</span></p>}
          {sessionState.ownerName && <p className="text-sm text-muted-foreground">Owner: <span className="text-foreground">{sessionState.ownerName}</span></p>}
          <p className="text-sm text-muted-foreground">Menu Items: <span className="text-foreground">{importedItems.length} imported</span></p>

          <div className="pt-3 space-y-2">
            {sessionState.restaurantId && <CopyableId label="Restaurant ID" value={sessionState.restaurantId} />}
            {sessionState.deviceId && <CopyableId label="Device ID" value={sessionState.deviceId} />}
            {sessionState.ownerId && <CopyableId label="Owner ID" value={sessionState.ownerId} />}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onDashboard} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => setShowJson(!showJson)} className="flex-1 border-border text-muted-foreground hover:text-foreground">
            {showJson ? "Hide" : "View"} JSON
          </Button>
        </div>

        {showJson && (
          <pre className="mt-6 p-4 rounded-xl bg-muted text-left text-xs font-mono text-muted-foreground overflow-auto max-h-80">
            {JSON.stringify({ session: sessionState, importedItems }, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
