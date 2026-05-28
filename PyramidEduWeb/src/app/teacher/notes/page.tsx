"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import UploadNotes from "./UploadNotes";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";

const files = [
  { file: "Chapter 4 Notes.pdf", cls: "G10-A", uploaded: "2026-05-20", status: "Published" },
  { file: "Lab Guide.pdf", cls: "G11-B", uploaded: "2026-05-18", status: "Published" },
  { file: "Essay Tips.pdf", cls: "G9-C", uploaded: "2026-05-16", status: "Draft" },
];

export default function Page() {
  const columns = [
    { key: "file", label: "File" },
    { key: "cls", label: "Class" },
    { key: "uploaded", label: "Uploaded" },
    { key: "status", label: "Status" },
  ];

  const [selectedBatch, setSelectedBatch] = useState<string>("");

  // Filter files based on selected batch
  const filteredFiles = selectedBatch
    ? files.filter((f) => f.cls === selectedBatch)
    : files;

  // Compute stats from filtered data
  const filteredStats = [
    {
      name: "Published",
      value: filteredFiles.filter((f) => f.status === "Published").length,
      fill: "#7C3AED",
    },
    {
      name: "Draft",
      value: filteredFiles.filter((f) => f.status === "Draft").length,
      fill: "#06B6D4",
    },
  ];

  // Unique batches for dropdown
  const batches = Array.from(new Set(files.map((f) => f.cls)));

  return (
    <div className="space-y-6">
      {/* Batch filter dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="batch" className="text-sm font-medium text-muted-foreground">
          Filter by Batch:
        </label>
        <select
          id="batch"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="rounded border border-muted-foreground/30 p-2"
        >
          <option value="">All Batches</option>
          {batches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Materials" value={filteredFiles.length.toString()} />
        <StatCard label="Published" value={filteredStats[0].value.toString()} />
        <StatCard label="Drafts" value={filteredStats[1].value.toString()} />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Materials Overview</h3>
        <p className="text-xs text-muted-foreground">Distribution by status</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={filteredStats}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <UploadNotes />

      <MockCrudTable
        columns={columns}
        initialRows={filteredFiles}
        title="Notes & Materials"
        description="Upload and manage study materials."
      />
    </div>
  );
}
