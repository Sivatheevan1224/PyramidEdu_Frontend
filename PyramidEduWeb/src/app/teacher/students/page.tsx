"use client";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const students = [
  { name: "N. Priyanka", cls: "G10-A", attendance: 96, status: "Active" },
  { name: "T. Rajan", cls: "G11-B", attendance: 90, status: "Active" },
  { name: "S. Kavya", cls: "G9-C", attendance: 98, status: "Active" },
];

const byClass = [
  { c: "G9-C", avg: 97 }, { c: "G10-A", avg: 94 }, { c: "G11-B", avg: 88 },
];

export default function Page() {
  const columns = [
    { key: "name", label: "Student" },
    { key: "cls", label: "Class" },
    { key: "attendance", label: "Attendance" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Students" value="186" delta="+2" />
        <StatCard label="Present Today" value="172" delta="-1" />
        <StatCard label="Avg Attendance" value="92%" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Attendance by Class</h3>
        <p className="text-xs text-muted-foreground">Average attendance this term</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byClass}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis dataKey="c" stroke="hsl(220 9% 46%)" fontSize={12} />
            <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
            <Bar dataKey="avg" fill="hsl(243 75% 59%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <MockCrudTable columns={columns} initialRows={students} title="Students" description="Manage students and quick actions" />
    </div>
  );
}
