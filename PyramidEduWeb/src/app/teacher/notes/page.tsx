"use client";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";

const files = [
  { file: "Chapter 4 Notes.pdf", cls: "G10-A", uploaded: "2026-05-20", status: "Published" },
  { file: "Lab Guide.pdf", cls: "G11-B", uploaded: "2026-05-18", status: "Published" },
  { file: "Essay Tips.pdf", cls: "G9-C", uploaded: "2026-05-16", status: "Draft" },
];

const stats = [
  { name: "Published", value: 2, fill: "#7C3AED" },
  { name: "Draft", value: 1, fill: "#06B6D4" },
];

export default function Page() {
  const columns = [
    { key: "file", label: "File" },
    { key: "cls", label: "Class" },
    { key: "uploaded", label: "Uploaded" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Materials" value="34" />
        <StatCard label="Published" value="28" />
        <StatCard label="Drafts" value="6" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Materials Overview</h3>
        <p className="text-xs text-muted-foreground">Distribution by status</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={stats} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4} />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <MockCrudTable columns={columns} initialRows={files} title="Notes & Materials" description="Upload and manage study materials." />
    </div>
  );
}
