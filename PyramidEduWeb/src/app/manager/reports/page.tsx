"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const reportBreakdown = [
  { name: "Attendance", value: 40 },
  { name: "Marks", value: 30 },
  { name: "Behavior", value: 20 },
  { name: "Other", value: 10 },
];
const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#ef4444"];

export default function ManagerReportsPage() {
  return (
    <div className="p-6 space-y-6">
      

      <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-1/2">
          <h3 className="text-lg font-semibold mb-3">Report Breakdown</h3>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={reportBreakdown} dataKey="value" nameKey="name" outerRadius={80} label>
                  {reportBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full sm:w-1/2">
          <h3 className="text-lg font-semibold mb-3">Recent Reports</h3>
          <MockCrudTable title="Reports" columns={["title", "author", "status"]} initialData={[]} />
        </div>
      </Card>
    </div>
  );
}

