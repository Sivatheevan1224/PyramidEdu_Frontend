"use client";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const quizzes = [
  { title: "Chapter 3", cls: "G10-A", due: "2026-05-30", status: "Draft" },
  { title: "Algebra", cls: "G11-B", due: "2026-05-28", status: "Published" },
  { title: "Grammar", cls: "G9-C", due: "2026-05-26", status: "Published" },
];

const trend = [
  { week: "W1", avg: 78 }, { week: "W2", avg: 81 }, { week: "W3", avg: 84 }, { week: "W4", avg: 79 },
];

export default function Page() {
  const columns = [
    { key: "title", label: "Quiz" },
    { key: "cls", label: "Class" },
    { key: "due", label: "Due Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Quizzes" value="24" />
        <StatCard label="Published" value="18" />
        <StatCard label="Avg. Score" value="81%" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Class Quiz Trend</h3>
        <p className="text-xs text-muted-foreground">Average quiz score by week</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis dataKey="week" stroke="hsl(220 9% 46%)" fontSize={12} />
            <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
            <Line type="monotone" dataKey="avg" stroke="hsl(243 75% 59%)" strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <MockCrudTable columns={columns} initialRows={quizzes} title="Quizzes" description="Create and manage quizzes" />
    </div>
  );
}
