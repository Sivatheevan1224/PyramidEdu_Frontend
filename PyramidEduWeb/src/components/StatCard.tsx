import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon: React.ElementType;
  accent?: "primary" | "secondary" | "accent" | "warning";
}

const accentMap = {
  primary: "from-primary to-[hsl(var(--primary-glow))]",
  secondary: "from-secondary to-primary",
  accent: "from-accent to-secondary",
  warning: "from-warning to-accent",
};

export const StatCard = ({ label, value, delta, trend = "up", icon: Icon, accent = "primary" }: StatCardProps) => (
  <Card className="relative overflow-hidden p-5 transition-base hover:shadow-elegant">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        {delta && (
          <p className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", trend === "up" ? "text-accent" : "text-destructive")}>
            {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </p>
        )}
      </div>
      <div className={cn("grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-primary-foreground shadow-elegant", accentMap[accent])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </Card>
);
