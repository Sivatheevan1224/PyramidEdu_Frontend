"use client";

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, UserCog, CreditCard, BarChart3, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts";

const revenue = [
  { m: "Jan", v: 42000 }, { m: "Feb", v: 47000 }, { m: "Mar", v: 43000 },
  { m: "Apr", v: 51000 }, { m: "May", v: 55000 }, { m: "Jun", v: 60000 },
];
const roleBreakdown = [
  { r: "Students", v: 1200 }, { r: "Teachers", v: 85 }, { r: "Admins", v: 12 },
];
// User growth (monthly new users)
const userGrowth = [
  { m: "Jan", v: 300 }, { m: "Feb", v: 350 }, { m: "Mar", v: 400 },
  { m: "Apr", v: 450 }, { m: "May", v: 500 }, { m: "Jun", v: 550 },
];
// Course completion rates per month (%)
const courseCompletion = [
  { m: "Jan", v: 78 }, { m: "Feb", v: 80 }, { m: "Mar", v: 82 },
  { m: "Apr", v: 85 }, { m: "May", v: 87 }, { m: "Jun", v: 90 },
];
const recentAdmins = [
  { name: "Dr. Faisal Malik", institute: "Al-Noor Academy", status: "Active" },
  { name: "Ms. Priya Sharma", institute: "Bright Future School", status: "Active" },
  { name: "Mr. James Okonkwo", institute: "Unity College", status: "Pending" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Institutes" value="52" delta="+3" icon={UserCog} accent="primary" />
        <StatCard label="Total Students" value="12,840" delta="+420" icon={Users} accent="secondary" />
        <StatCard label="Total Teachers" value="640" delta="+18" icon={GraduationCap} accent="accent" />
        <StatCard label="CPU Usage" value="45%" delta="+5%" icon={TrendingUp} accent="primary" />
        <StatCard label="Memory Usage" value="68%" delta="+2%" icon={TrendingUp} accent="secondary" />
        <StatCard label="Uptime" value="72h" delta="+12h" icon={TrendingUp} accent="accent" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Platform Revenue</h3>
          <p className="text-xs text-muted-foreground">Monthly subscription revenue</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(243 75% 59%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(243 75% 59%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="m" stroke="hsl(220 9% 46%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
              <Area type="monotone" dataKey="v" stroke="hsl(243 75% 59%)" strokeWidth={2.5} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Role Distribution</h3>
          <p className="text-xs text-muted-foreground">Users by role across platform</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={roleBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis type="number" stroke="hsl(220 9% 46%)" fontSize={12} />
              <YAxis dataKey="r" type="category" stroke="hsl(220 9% 46%)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
              <Bar dataKey="v" fill="hsl(243 75% 59%)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      {/* Additional Reports */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">User Growth</h3>
          <p className="text-xs text-muted-foreground">Monthly new user sign‑ups</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(120 70% 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(120 70% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="m" stroke="hsl(220 9% 46%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
              <Area type="monotone" dataKey="v" stroke="hsl(120 70% 50%)" strokeWidth={2.5} fill="url(#grad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Course Completion Rate</h3>
          <p className="text-xs text-muted-foreground">Percentage of courses completed each month</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={courseCompletion}>
              <defs>
                <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(240 70% 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(240 70% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="m" stroke="hsl(220 9% 46%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
              <Area type="monotone" dataKey="v" stroke="hsl(240 70% 55%)" strokeWidth={2.5} fill="url(#grad3)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-5 hover:shadow-lg transition-shadow duration-300">
        <h3 className="font-semibold">Recent Admin Registrations</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="pb-3">Admin</th>
                <th className="pb-3">Institute</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAdmins.map((a) => (
                <tr key={a.name} className="border-b last:border-0">
                  <td className="py-3 font-medium">{a.name}</td>
                  <td className="py-3 text-muted-foreground">{a.institute}</td>
                  <td className="py-3">
                    <Badge variant={a.status === "Active" ? "default" : "secondary"}>{a.status}</Badge>
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
