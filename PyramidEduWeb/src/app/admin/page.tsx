"use client";

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, UserCog, TrendingUp, CreditCard } from "lucide-react";

const recentAdmins = [
  { name: "Dr. Faisal Malik", status: "Active" },
  { name: "Ms. Priya Sharma", status: "Active" },
  { name: "Mr. James Okonkwo", status: "Pending" },
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
        <StatCard label="New Users" value="3,200" delta="+200" icon={Users} accent="primary" />
        <StatCard label="Total Users" value="14,280" delta="+500" icon={UserCog} accent="secondary" />
        <StatCard label="Total Growth" value="15%" delta="+1%" icon={TrendingUp} accent="accent" />
        <StatCard label="Salary Expense" value="$120,000" delta="+$5,000" icon={CreditCard} accent="primary" />
        <StatCard label="Fee Income" value="$250,000" delta="+$10,000" icon={CreditCard} accent="secondary" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Recent Admin Registrations</h3>
          <ul className="mt-2 space-y-2">
            {recentAdmins.map((a) => (
              <li key={a.name} className="flex justify-between items-center">
                <span>{a.name}</span>
                <Badge variant={a.status === "Active" ? "default" : "secondary"}>{a.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
