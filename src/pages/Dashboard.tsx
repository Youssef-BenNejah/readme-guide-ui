import {
  Store,
  Tablet,
  User,
  Plus,
  UtensilsCrossed,
  Copy,
  Check,
  LayoutDashboard,
  ChevronRight,
  Package,
  Grid3X3,
  Settings2,
  Receipt,
  Layers,
  Trash2,
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
import type { Restaurant } from "@/types/session";

interface DashboardProps {
  restaurants: Restaurant[];
  onAddNew: () => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
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
      {copied ? <Check className="w-3 h-3 text-[hsl(var(--success))]" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <Card className="border-border bg-card hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard({ restaurants, onAddNew, onDelete, onSelect, selectedId }: DashboardProps) {
  const totalItems = restaurants.reduce((sum, r) => sum + r.menuItems.length, 0);
  const selected = restaurants.find((r) => r.id === selectedId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-orange">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl text-foreground">Restaurant Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage all your restaurants</p>
            </div>
          </div>
          <Button onClick={onAddNew} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Add New Restaurant
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Store} label="Restaurants" value={String(restaurants.length)} accent />
          <StatCard icon={Tablet} label="Devices" value={String(restaurants.length)} />
          <StatCard icon={UtensilsCrossed} label="Menu Items" value={String(totalItems)} />
          <StatCard icon={User} label="Owners" value={String(restaurants.length)} />
        </div>

        {restaurants.length === 0 ? (
          <Card className="border-border bg-card border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-xl text-foreground mb-2">No restaurants yet</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Get started by adding your first restaurant. The setup wizard will guide you through everything.
              </p>
              <Button onClick={onAddNew} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Restaurant
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Restaurant List */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Your Restaurants
              </h2>
              {restaurants.map((r) => (
                <Card
                  key={r.id}
                  onClick={() => onSelect(r.id)}
                  className={`border-border bg-card cursor-pointer transition-all hover:border-primary/40 ${
                    selectedId === r.id ? "border-primary ring-1 ring-primary/20" : ""
                  }`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Store className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.menuItems.length} item{r.menuItems.length !== 1 ? "s" : ""} · {r.owner}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(r.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-2">
              {selected ? (
                <Tabs defaultValue="overview" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg text-foreground">{selected.name}</h2>
                    <TabsList className="bg-secondary">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="menu">Menu</TabsTrigger>
                      <TabsTrigger value="ids">IDs</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-border bg-card">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Store className="w-4 h-4 text-primary" /> Profile
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <InfoRow label="Name" value={selected.name} />
                          <InfoRow label="Owner" value={selected.owner} />
                          <InfoRow label="Created" value={new Date(selected.createdAt).toLocaleDateString()} />
                        </CardContent>
                      </Card>
                      <Card className="border-border bg-card">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Layers className="w-4 h-4 text-primary" /> Catalog
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <InfoRow label="Tax Rate" value={selected.taxRate ? `${selected.taxRate} (${selected.taxRateValue}%)` : null} icon={Receipt} />
                          <InfoRow label="Family" value={selected.family} icon={Package} />
                          <InfoRow label="Category" value={selected.category} icon={Grid3X3} />
                          <InfoRow label="Modifier Group" value={selected.modifierGroup} icon={Settings2} />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="menu">
                    <Card className="border-border bg-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <UtensilsCrossed className="w-4 h-4 text-primary" /> Menu Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selected.menuItems.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">No menu items yet.</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Price</TableHead>
                                <TableHead className="text-muted-foreground">Category</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selected.menuItems.map((item, i) => (
                                <TableRow key={i} className="border-border">
                                  <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                                  <TableCell className="text-primary font-mono">{item.price?.toFixed(3)} DT</TableCell>
                                  <TableCell className="text-muted-foreground">{item.category || "—"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ids">
                    <Card className="border-border bg-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Settings2 className="w-4 h-4 text-primary" /> System IDs
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
                            <TableRow className="border-border">
                              <TableCell className="font-medium text-foreground">Restaurant</TableCell>
                              <TableCell><CopyId value={selected.id} /></TableCell>
                            </TableRow>
                            <TableRow className="border-border">
                              <TableCell className="font-medium text-foreground">Device</TableCell>
                              <TableCell><CopyId value={selected.deviceId} /></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="border-border bg-card border-dashed h-full flex items-center justify-center">
                  <CardContent className="text-center py-16">
                    <p className="text-sm text-muted-foreground">Select a restaurant to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon, muted }: { label: string; value: string | null | undefined; icon?: any; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span className={`text-sm font-medium ${muted ? "text-muted-foreground italic" : "text-foreground"}`}>
        {value || "—"}
      </span>
    </div>
  );
}
