"use client";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const sessions = [
  { session: "Morning Check", cls: "G10-A", date: "2026-05-24", status: "Closed" },
  { session: "Lab Attendance", cls: "G11-B", date: "2026-05-23", status: "Closed" },
  { session: "Evening Check", cls: "G9-C", date: "2026-05-24", status: "Open" },
];

const activity = [
  { day: "Mon", scans: 120 }, { day: "Tue", scans: 132 }, { day: "Wed", scans: 98 }, { day: "Thu", scans: 140 }, { day: "Fri", scans: 110 },
];

export default function Page() {
  const columns = [
    { key: "session", label: "Session" },
    { key: "cls", label: "Class" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active Sessions" value="3" />
        <StatCard label="Scans Today" value="432" />
        <StatCard label="Open Sessions" value="1" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Scan Activity</h3>
        <p className="text-xs text-muted-foreground">QR scans per weekday</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={activity}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis dataKey="day" stroke="hsl(220 9% 46%)" fontSize={12} />
            <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
            <Area type="monotone" dataKey="scans" stroke="hsl(243 75% 59%)" fill="rgba(124,58,237,0.12)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <MockCrudTable columns={columns} initialRows={sessions} title="QR Attendance" description="Manage QR attendance sessions and logs." />
    </div>
  );
}
