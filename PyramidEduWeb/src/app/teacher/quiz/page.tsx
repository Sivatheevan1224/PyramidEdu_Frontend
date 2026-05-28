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

const assignments = [
  { title: "Essay Assignment", cls: "G10-A", due: "2026-06-05", status: "Pending" },
  { title: "Project Work", cls: "G11-B", due: "2026-06-10", status: "Published" },
];

const mcqs = [
  { question: "What is 2+2?", topic: "Math", difficulty: "Easy", status: "Approved" },
  { question: "Explain photosynthesis.", topic: "Biology", difficulty: "Medium", status: "Draft" },
];

const gradeTrend = [
  { assignment: "Essay Assignment", avgScore: 78 },
  { assignment: "Project Work", avgScore: 85 },
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
                <LineChart data={gradeTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                  <XAxis dataKey="week" stroke="hsl(220 9% 46%)" fontSize={12} />
                  <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(243 75% 59%)" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Assignments Section */}
            <Card className="p-5">
              <h3 className="font-semibold">Assignments</h3>
              <p className="text-xs text-muted-foreground">Manage class assignments</p>
              <MockCrudTable columns={[
                { key: "title", label: "Assignment" },
                { key: "cls", label: "Class" },
                { key: "due", label: "Due Date" },
                { key: "status", label: "Status" },
              ]} initialRows={assignments} title="Assignments" description="Create and manage assignments" />
            </Card>

            {/* MCQs Section */}
            <Card className="p-5">
              <h3 className="font-semibold">MCQs</h3>
              <p className="text-xs text-muted-foreground">Multiple choice questions bank</p>
              <MockCrudTable columns={[
                { key: "question", label: "Question" },
                { key: "topic", label: "Topic" },
                { key: "difficulty", label: "Difficulty" },
                { key: "status", label: "Status" },
              ]} initialRows={mcqs} title="MCQs" description="Create and manage MCQs" />
            </Card>

            {/* Grades Overview */}
            <Card className="p-5">
              <h3 className="font-semibold">Grades Overview</h3>
              <p className="text-xs text-muted-foreground">Average grades per assignment</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={gradeTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                  <XAxis dataKey="assignment" stroke="hsl(220 9% 46%)" fontSize={12} />
                  <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
                  <Line type="monotone" dataKey="avgScore" stroke="hsl(10 80% 55%)" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <MockCrudTable columns={columns} initialRows={quizzes} title="Quizzes" description="Create and manage quizzes" />
          </div>
        );
}
