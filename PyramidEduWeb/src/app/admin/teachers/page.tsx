import { MockCrudTable } from "@/components/MockCrudTable";
import { StatCard } from "@/components/StatCard";
import { GraduationCap, BookOpen, Users } from "lucide-react";

const columns = [
  { key: "teacher", label: "Teacher" },
  { key: "institute", label: "Institute" },
  { key: "subject", label: "Subject" },
  { key: "status", label: "Status" },
];

const rows = [
  { teacher: "P. Sharma", institute: "Bright Future School", subject: "Mathematics", status: "Active" },
  { teacher: "J. Okonkwo", institute: "Unity College", subject: "Science", status: "Active" },
  { teacher: "F. Malik", institute: "Al-Noor Academy", subject: "English", status: "Pending" },
];

const chart = {
  title: "Teachers Added",
  xKey: "month",
  yKey: "count",
  data: [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 14 },
    { month: "Mar", count: 18 },
    { month: "Apr", count: 16 },
    { month: "May", count: 20 },
  ],
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Teachers" value="640" icon={GraduationCap} accent="primary" />
        <StatCard label="Subjects" value="18" icon={BookOpen} accent="secondary" />
        <StatCard label="Assignments" value="142" icon={Users} accent="accent" />
      </div>

      <MockCrudTable
        title="Teachers"
        description="Review teacher profiles and assignments."
        columns={columns}
        initialRows={rows}
        chart={chart}
      />
    </div>
  );
}
