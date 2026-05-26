"use client";

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Users, TrendingUp, ShieldCheck, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const usage = [
  { month: "Jan", users: 980 },
  { month: "Feb", users: 1040 },
  { month: "Mar", users: 1120 },
  { month: "Apr", users: 1190 },
  { month: "May", users: 1284 },
  { month: "Jun", users: 1360 },
];

const kpis = [
  { label: "Active Users", value: "1,284", icon: Users, accent: "primary" as const },
  { label: "Monthly Revenue", value: "Rs. 1.2M", icon: TrendingUp, accent: "secondary" as const },
  { label: "Security Incidents", value: "0", icon: ShieldCheck, accent: "accent" as const },
  { label: "Avg. Session", value: "6m 12s", icon: Activity, accent: "warning" as const },
];

const metrics = [
  { name: "Retention Rate", value: "82%", change: "+1.4%" },
  { name: "Churn Rate", value: "2.1%", change: "-0.4%" },
  { name: "New Institutes", value: "6", change: "+2" },
  { name: "Support Tickets", value: "14", change: "-3" },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Analytics</h2>
        <p className="text-sm text-muted-foreground">Platform trends and growth metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            accent={kpi.accent}
          />
        ))}
      </div>

      <Card className="p-4">
        <p className="text-sm font-semibold mb-3">Monthly Active Users</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={usage}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
            <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Metric</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Value</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Change</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.name} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{metric.name}</td>
                <td className="px-4 py-3 text-foreground">{metric.value}</td>
                <td className="px-4 py-3 text-foreground">{metric.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
