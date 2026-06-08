"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const examTrend = [
  { month: "Jan", avg: 75 },
  { month: "Mar", avg: 78 },
  { month: "May", avg: 80 },
  { month: "Jul", avg: 82 },
  { month: "Sep", avg: 79 },
];

export default function TeacherExamsPage() {
  return (
    <div className="p-6 space-y-6">
      

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Exam Performance Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={examTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avg" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <MockCrudTable title="Exam Records" columns={["exam", "batch", "date", "status"]} initialData={[]} />
    </div>
  );
}

