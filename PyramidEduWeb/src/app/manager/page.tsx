"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  Megaphone,
  UserPlus,
  CheckSquare,
  QrCode,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import Link from "next/link";
import api from "@/lib/api";

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
  const [pendingFees, setPendingFees] = useState({ amount: 125000, count: 18 });

  useEffect(() => {
    async function fetchPendingFees() {
      try {
        const res = await api.get("/manager/dashboard");
        if (res.data?.data?.summaryCards?.pendingFees) {
          setPendingFees({
            amount: res.data.data.summaryCards.pendingFees.amount,
            count: res.data.data.summaryCards.pendingFees.studentsCount,
          });
        }
      } catch (err) {
        console.error("Failed to fetch pending fees from database:", err);
      }
    }
    fetchPendingFees();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value="842" delta="+24" icon={Users} accent="primary" />
        <StatCard
          label="Pending Fees"
          value={`LKR ${pendingFees.amount.toLocaleString()}`}
          delta={`${pendingFees.count} Students`}
          trend="down"
          icon={CreditCard}
          accent="accent"
        />
        <StatCard label="Avg. Attendance" value="89%" delta="+1.4%" icon={CalendarCheck} accent="secondary" />
        <StatCard label="Performance Index" value="78" delta="+2.1" icon={TrendingUp} accent="warning" />
      </div>

      {/* 2 & 3. Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Fee Collection</h3>
          <p className="text-xs text-muted-foreground">Paid vs. due over the last 6 months</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fees}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--card-foreground))"
                }}
              />
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
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--card-foreground))"
                }}
              />
              <Line type="monotone" dataKey="v" stroke="hsl(189 94% 43%)" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 4 & 5. Activities and Quick Actions Section (side-by-side on desktop) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 4. Recent Student Activities (col-span-2) */}
        <Card className="p-5 lg:col-span-2">
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

        {/* 5. Quick Actions (col-span-1) */}
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <p className="text-xs text-muted-foreground mb-4">Common administrative operations</p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/manager/registered-students" passHref className="w-full">
              <Button
                className="w-full text-xs font-semibold py-2.5 px-3 justify-center gap-2 border border-border cursor-pointer hover:bg-muted"
                variant="outline"
              >
                <UserPlus className="h-4 w-4 text-primary" />
                Register Student
              </Button>
            </Link>
            <Link href="/manager/fees" passHref className="w-full">
              <Button
                className="w-full text-xs font-semibold py-2.5 px-3 justify-center gap-2 border border-border cursor-pointer hover:bg-muted"
                variant="outline"
              >
                <CheckSquare className="h-4 w-4 text-accent" />
                Verify Payment
              </Button>
            </Link>
            <Link href="/manager/attendance" passHref className="w-full">
              <Button
                className="w-full text-xs font-semibold py-2.5 px-3 justify-center gap-2 border border-border cursor-pointer hover:bg-muted"
                variant="outline"
              >
                <QrCode className="h-4 w-4 text-secondary" />
                Take Attendance
              </Button>
            </Link>
            <Link href="/manager/announcements" passHref className="w-full">
              <Button
                className="w-full text-xs font-semibold py-2.5 px-3 justify-center gap-2 border border-border cursor-pointer hover:bg-muted"
                variant="outline"
              >
                <Megaphone className="h-4 w-4 text-warning" />
                Create Announce
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
