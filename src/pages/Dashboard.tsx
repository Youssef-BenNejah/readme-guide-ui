import {
  Store,
  Tablet,
  User,
  Receipt,
  Package,
  Grid3X3,
  Layers,
  Settings2,
  UtensilsCrossed,
  Copy,
  Check,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SessionState } from "@/types/session";

interface DashboardProps {
  sessionState: SessionState;
  onBack: () => void;
}

function CopyId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <span className="truncate max-w-[180px]">{value}</span>
      {copied ? (
        <Check className="w-3 h-3 text-[hsl(var(--success))]" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <Card className="border-border bg-card hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p
              className={`text-lg font-semibold ${accent ? "text-primary" : "text-foreground"}`}
            >
              {value}
            </p>
            {sub && (
              <p className="text-xs text-muted-foreground">{sub}</p>
            )}
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard({ sessionState, onBack }: DashboardProps) {
  const s = sessionState;

  const menuItems = [
    ...(s.menuItemName
      ? [
          {
            name: s.menuItemName,
            price: s.menuItemPrice,
            family: s.familyName,
            category: s.categoryName,
            modifierGroup: s.modifierGroupName,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-orange">
                <LayoutDashboard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-xl text-foreground">
                  {s.restaurantName || "Restaurant"} Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">
                  Overview of your restaurant setup
                </p>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-[hsl(var(--success))]/30 text-[hsl(var(--success))] bg-[hsl(var(--success))]/5"
          >
            Setup Complete
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Store}
            label="Restaurant"
            value={s.restaurantName || "—"}
            sub={s.restaurantId ? `ID: ${s.restaurantId.slice(0, 8)}…` : undefined}
            accent
          />
          <StatCard
            icon={Tablet}
            label="Device"
            value="POS Terminal"
            sub={s.deviceId ? `ID: ${s.deviceId.slice(0, 8)}…` : undefined}
          />
          <StatCard
            icon={User}
            label="Owner"
            value={s.ownerName || "Owner"}
            sub={s.ownerId ? `ID: ${s.ownerId.slice(0, 8)}…` : undefined}
          />
          <StatCard
            icon={UtensilsCrossed}
            label="Menu Items"
            value={String(menuItems.length)}
            sub="items created"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="ids">System IDs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Restaurant Info */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Store className="w-4 h-4 text-primary" />
                    Restaurant Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow label="Name" value={s.restaurantName} />
                  <InfoRow label="Owner" value={s.ownerName || "Owner"} />
                  <InfoRow
                    label="Tax Rate"
                    value={
                      s.taxRateLabel
                        ? `${s.taxRateLabel} (${s.taxRateValue}%)`
                        : null
                    }
                  />
                  <InfoRow label="Product Family" value={s.familyName} />
                </CardContent>
              </Card>

              {/* Catalog Structure */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Catalog Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow label="Product Family" value={s.familyName} icon={Package} />
                  <InfoRow label="Menu Category" value={s.categoryName} icon={Grid3X3} />
                  <InfoRow
                    label="Modifier Group"
                    value={
                      s.skippedStep8
                        ? "Skipped"
                        : s.modifierGroupName
                    }
                    icon={Settings2}
                    muted={s.skippedStep8}
                  />
                  <InfoRow
                    label="Tax Rate"
                    value={
                      s.taxRateLabel
                        ? `${s.taxRateLabel} — ${s.taxRateValue}%`
                        : null
                    }
                    icon={Receipt}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-primary" />
                  Menu Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {menuItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No menu items created yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Price</TableHead>
                        <TableHead className="text-muted-foreground">Family</TableHead>
                        <TableHead className="text-muted-foreground">Category</TableHead>
                        <TableHead className="text-muted-foreground">Modifier Group</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item, i) => (
                        <TableRow key={i} className="border-border">
                          <TableCell className="font-medium text-foreground">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-primary font-mono">
                            {item.price?.toFixed(3)} DT
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.family || "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.category || "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.modifierGroup || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System IDs Tab */}
          <TabsContent value="ids" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  System Identifiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Resource</TableHead>
                      <TableHead className="text-muted-foreground">ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "Restaurant", id: s.restaurantId },
                      { label: "Device", id: s.deviceId },
                      { label: "Owner", id: s.ownerId },
                      { label: "Tax Rate", id: s.taxRateId },
                      { label: "Product Family", id: s.familyId },
                      { label: "Menu Category", id: s.categoryId },
                      { label: "Modifier Group", id: s.modifierGroupId },
                    ]
                      .filter((r) => r.id)
                      .map((r) => (
                        <TableRow key={r.label} className="border-border">
                          <TableCell className="font-medium text-foreground">
                            {r.label}
                          </TableCell>
                          <TableCell>
                            <CopyId value={r.id!} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Raw JSON */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-foreground">
                  Raw Session Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 rounded-lg bg-muted text-xs font-mono text-muted-foreground overflow-auto max-h-80">
                  {JSON.stringify(sessionState, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon: Icon,
  muted,
}: {
  label: string;
  value: string | null | undefined;
  icon?: any;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span
        className={`text-sm font-medium ${muted ? "text-muted-foreground italic" : "text-foreground"}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}
