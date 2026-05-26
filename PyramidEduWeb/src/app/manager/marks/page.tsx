"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const marksData = [
  { subject: "Math", avg: 78 },
  { subject: "Science", avg: 82 },
  { subject: "English", avg: 75 },
  { subject: "History", avg: 80 },
];

export default function ManagerMarksPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Avg Score" value="79" />
        <StatCard title="Top Performer" value="Sara K." />
        <StatCard title="Underperforming" value="12" />
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Subject Averages</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={marksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <MockCrudTable title="Marks Ledger" columns={["student", "subject", "score"]} initialData={[]} />
    </div>
  );
}

