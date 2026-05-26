import { MockCrudTable } from "@/components/MockCrudTable";
import { StatCard } from "@/components/StatCard";
import { Users, TrendingUp, ShieldCheck } from "lucide-react";

const columns = [
  { key: "student", label: "Student" },
  { key: "institute", label: "Institute" },
  { key: "grade", label: "Grade" },
  { key: "status", label: "Status" },
];

const rows = [
  { student: "N. Priyanka", institute: "Bright Future School", grade: "G10", status: "Active" },
  { student: "T. Rajan", institute: "Unity College", grade: "G12", status: "Active" },
  { student: "S. Kavya", institute: "Al-Noor Academy", grade: "G9", status: "Pending" },
];

const chart = {
  title: "Student Enrollment",
  xKey: "month",
  yKey: "count",
  data: [
    { month: "Jan", count: 340 },
    { month: "Feb", count: 360 },
    { month: "Mar", count: 410 },
    { month: "Apr", count: 450 },
    { month: "May", count: 520 },
  ],
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Enrolled" value="12,840" icon={Users} accent="primary" />
        <StatCard label="Active" value="11,920" icon={TrendingUp} accent="accent" />
        <StatCard label="At Risk" value="64" icon={ShieldCheck} accent="warning" />
      </div>

      <MockCrudTable
        title="Students"
        description="Monitor student enrollment across institutes."
        columns={columns}
        initialRows={rows}
        chart={chart}
      />
    </div>
  );
}
