"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const attendanceData = [
  { date: "Mon", present: 120 },
  { date: "Tue", present: 110 },
  { date: "Wed", present: 115 },
  { date: "Thu", present: 105 },
  { date: "Fri", present: 125 },
];

export default function ManagerAttendancePage() {
  return (
    <div className="space-y-6 p-6">
      

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Weekly Attendance</h3>
        <div className="h-60 w-full">
          <ResponsiveContainer>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <MockCrudTable
        title="Attendance Records"
        columns={["student", "date", "status"]}
        initialData={[]}
      />
    </div>
  );
}
 
