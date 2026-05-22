
"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Brain, TrendingDown, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const trend = [
  { m: "Jan", a: 78, b: 62, c: 88 }, { m: "Feb", a: 80, b: 60, c: 86 },
  { m: "Mar", a: 79, b: 58, c: 90 }, { m: "Apr", a: 82, b: 55, c: 91 },
  { m: "May", a: 84, b: 52, c: 92 }, { m: "Jun", a: 86, b: 48, c: 94 },
];
const atRisk = [
  { name: "Daniel Lee", roll: "10A-04", risk: 82, trend: "down", reason: "Attendance + low quiz scores" },
  { name: "Rohan Mehta", roll: "10A-02", risk: 64, trend: "down", reason: "Missed assignments" },
  { name: "Sara Ali", roll: "10A-03", risk: 41, trend: "up", reason: "Recovering after absences" },
];

export default function AiPredictionPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5"><div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Brain className="h-5 w-5" /></div>
          <div><p className="text-xs text-muted-foreground">Model accuracy</p><p className="text-2xl font-bold">94.2%</p></div>
        </div></Card>
        <Card className="p-5"><div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-warning/10 text-warning"><AlertTriangle className="h-5 w-5" /></div>
          <div><p className="text-xs text-muted-foreground">At-risk students</p><p className="text-2xl font-bold">12</p></div>
        </div></Card>
        <Card className="p-5"><div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent"><TrendingUp className="h-5 w-5" /></div>
          <div><p className="text-xs text-muted-foreground">Improving</p><p className="text-2xl font-bold">28</p></div>
        </div></Card>
      </div>
      <Card className="p-5">
        <h3 className="font-semibold">Cohort Trajectory</h3>
        <p className="text-xs text-muted-foreground">Predicted weighted scores by segment</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis dataKey="m" stroke="hsl(220 9% 46%)" fontSize={12} />
            <YAxis stroke="hsl(220 9% 46%)" fontSize={12} domain={[40, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
            <Line type="monotone" dataKey="a" name="Average" stroke="hsl(243 75% 59%)" strokeWidth={2.5} />
            <Line type="monotone" dataKey="b" name="At-risk" stroke="hsl(0 84% 60%)" strokeWidth={2.5} />
            <Line type="monotone" dataKey="c" name="Top performers" stroke="hsl(142 71% 45%)" strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">At-Risk Students</h3>
          <Button variant="soft" size="sm">Generate intervention plan</Button>
        </div>
        <div className="mt-4 space-y-3">
          {atRisk.map((s) => (
            <div key={s.roll} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{s.name} <span className="text-xs text-muted-foreground">· {s.roll}</span></p>
                  <p className="text-xs text-muted-foreground">{s.reason}</p>
                </div>
                <Badge variant={s.risk > 70 ? "destructive" : "secondary"}>
                  {s.trend === "down" ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                  Risk {s.risk}%
                </Badge>
              </div>
              <Progress value={s.risk} className="mt-3 h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

