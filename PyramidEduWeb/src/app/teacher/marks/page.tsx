"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const radarData = [
  { subject: "Math", A: 85 },
  { subject: "Science", A: 78 },
  { subject: "English", A: 72 },
  { subject: "Arts", A: 88 },
  { subject: "PE", A: 90 },
];

export default function TeacherMarksPage() {
  return (
    <div className="p-6 space-y-6">
      

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Subject Radar</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} />
              <Radar name="Avg" dataKey="A" stroke="#ef4444" fill="#fecaca" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <MockCrudTable title="Student Scores" columns={["student", "subject", "score"]} initialData={[]} />
    </div>
  );
}

