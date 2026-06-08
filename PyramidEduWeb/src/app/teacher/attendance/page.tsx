"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const weekly = [
  { day: "Mon", count: 30 },
  { day: "Tue", count: 28 },
  { day: "Wed", count: 29 },
  { day: "Thu", count: 27 },
  { day: "Fri", count: 31 },
];

export default function TeacherAttendancePage() {
  return (
    <div className="p-6 space-y-6">
      

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Attendance Trend</h3>
        <div className="h-60 w-full">
          <ResponsiveContainer>
            <AreaChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#10b981" fill="#bbf7d0" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <MockCrudTable title="Class Roster" columns={["student", "status"]} initialData={[]} />
    </div>
  );
}
