"use client";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, CalendarCheck, TrendingUp } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";

const fees = [
  { m: "Apr", paid: 32000, due: 8000 },
  { m: "May", paid: 36000, due: 6500 },
  { m: "Jun", paid: 41000, due: 5200 },
  { m: "Jul", paid: 39000, due: 7100 },
  { m: "Aug", paid: 45000, due: 4900 },
  { m: "Sep", paid: 48000, due: 4200 },
];

const attendance = [
  { d: "Mon", v: 92 }, { d: "Tue", v: 88 }, { d: "Wed", v: 94 },
  { d: "Thu", v: 90 }, { d: "Fri", v: 87 }, { d: "Sat", v: 80 },
];

const recent = [
  { name: "Aisha Khan", class: "Grade 10-A", status: "Paid" },
  { name: "Rohan Mehta", class: "Grade 9-B", status: "Pending" },
  { name: "Sara Ali", class: "Grade 11-C", status: "Paid" },
  { name: "Daniel Lee", class: "Grade 10-A", status: "Overdue" },
];

export default function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value="842" delta="+24" icon={Users} accent="primary" />
        <StatCard label="Fees Collected" value="$48k" delta="+9.2%" icon={CreditCard} accent="accent" />
        <StatCard label="Avg. Attendance" value="89%" delta="+1.4%" icon={CalendarCheck} accent="secondary" />
        <StatCard label="Performance Index" value="78" delta="+2.1" icon={TrendingUp} accent="warning" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Fee Collection</h3>
          <p className="text-xs text-muted-foreground">Paid vs. due over the last 6 months</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fees}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="m" stroke="hsl(220 9% 46%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
              <Legend />
              <Bar dataKey="paid" stackId="a" fill="hsl(243 75% 59%)" />
              <Bar dataKey="due" stackId="a" fill="hsl(38 92% 50%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Attendance Tracking</h3>
          <p className="text-xs text-muted-foreground">Daily attendance % this week</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={attendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="d" stroke="hsl(220 9% 46%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 46%)" fontSize={12} domain={[60, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
              <Line type="monotone" dataKey="v" stroke="hsl(189 94% 43%)" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-5">
        <h3 className="font-semibold">Recent Student Activity</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="pb-3">Student</th>
                <th className="pb-3">Class</th>
                <th className="pb-3">Fee Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.name} className="border-b last:border-0">
                  <td className="py-3 font-medium">{r.name}</td>
                  <td className="py-3 text-muted-foreground">{r.class}</td>
                  <td className="py-3">
                    <Badge variant={r.status === "Paid" ? "default" : r.status === "Pending" ? "secondary" : "destructive"}>
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
