"use client";

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { CreditCard, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const columns = [
  { key: "institute", label: "Institute" },
  { key: "plan", label: "Plan" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

const rows = [
  { institute: "Bright Future School", plan: "Pro", amount: "Rs. 48,000", status: "Paid" },
  { institute: "Unity College", plan: "Standard", amount: "Rs. 30,000", status: "Pending" },
  { institute: "Al-Noor Academy", plan: "Pro", amount: "Rs. 48,000", status: "Paid" },
];

const billing = [
  { month: "Jan", amount: 420000 },
  { month: "Feb", amount: 470000 },
  { month: "Mar", amount: 430000 },
  { month: "Apr", amount: 510000 },
  { month: "May", amount: 550000 },
  { month: "Jun", amount: 600000 },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Payments Overview</h2>
        <p className="text-sm text-muted-foreground">Track subscriptions and institute billing activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly Revenue" value="Rs. 550k" icon={TrendingUp} accent="primary" />
        <StatCard label="Paid Invoices" value="128" icon={Wallet} accent="accent" />
        <StatCard label="Pending" value="18" icon={AlertTriangle} accent="warning" />
        <StatCard label="Active Plans" value="52" icon={CreditCard} accent="secondary" />
      </div>

      <Card className="p-4">
        <p className="text-sm font-semibold mb-3">Monthly Billing</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={billing}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <MockCrudTable
        title="Invoices"
        description="Add, edit, or remove institute billing records."
        columns={columns}
        initialRows={rows}
      />
    </div>
  );
}
