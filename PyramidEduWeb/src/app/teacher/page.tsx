"use client";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpenCheck, CalendarCheck, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const classPerf = [
  { c: "10-A", avg: 84 }, { c: "10-B", avg: 78 }, { c: "11-A", avg: 91 },
  { c: "11-B", avg: 74 }, { c: "12-A", avg: 88 },
];
const recentActivity = [
  { name: "Aisha Khan", action: "Submitted quiz", time: "2 min ago" },
  { name: "Rohan Mehta", action: "Marked absent", time: "15 min ago" },
  { name: "Sara Ali", action: "Submitted assignment", time: "1 hr ago" },
  { name: "Daniel Lee", action: "Viewed notes", time: "2 hr ago" },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My Students" value="186" delta="+4" icon={Users} accent="primary" />
        <StatCard label="Quizzes Given" value="24" delta="+2" icon={BookOpenCheck} accent="accent" />
        <StatCard label="Avg. Attendance" value="87%" delta="-1.2%" trend="down" icon={CalendarCheck} accent="secondary" />
        <StatCard label="Class Avg. Score" value="82%" delta="+3%" icon={TrendingUp} accent="warning" />
      </div>
      <Card className="p-5">
        <h3 className="font-semibold">Class Performance</h3>
        <p className="text-xs text-muted-foreground">Average scores by class this term</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={classPerf}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis dataKey="c" stroke="hsl(220 9% 46%)" fontSize={12} />
            <YAxis stroke="hsl(220 9% 46%)" fontSize={12} domain={[60, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
            <Bar dataKey="avg" fill="hsl(243 75% 59%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold">Recent Student Activity</h3>
        <div className="mt-4 space-y-3">
          {recentActivity.map((a) => (
            <div key={a.name + a.time} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.action}</p>
              </div>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
