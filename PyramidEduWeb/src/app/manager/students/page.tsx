"use client";

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Users, TrendingUp, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const roster = [
  { name: "N. Priyanka", class: "G10-A", guardian: "S. Priya", status: "Active" },
  { name: "T. Rajan", class: "G11-B", guardian: "K. Rajan", status: "Active" },
  { name: "S. Kavya", class: "G9-C", guardian: "R. Kavya", status: "Pending" },
  { name: "A. Perera", class: "G10-A", guardian: "L. Perera", status: "Active" },
];

const statusData = [
  { name: "Active", value: 92 },
  { name: "Pending", value: 6 },
  { name: "Inactive", value: 2 },
];

const colors = ["hsl(142 71% 45%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)"];

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Students</h2>
        <p className="text-sm text-muted-foreground">View and manage student records.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Enrolled" value="842" icon={Users} accent="primary" />
        <StatCard label="Active" value="92%" icon={TrendingUp} accent="accent" />
        <StatCard label="At Risk" value="18" icon={AlertTriangle} accent="warning" />
      </div>

      <Card className="p-4">
        <p className="text-sm font-semibold mb-3">Student Status Mix</p>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Student</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Class</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Guardian</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((row) => (
              <tr key={row.name} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{row.name}</td>
                <td className="px-4 py-3 text-foreground">{row.class}</td>
                <td className="px-4 py-3 text-foreground">{row.guardian}</td>
                <td className="px-4 py-3 text-foreground">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
