import { MockCrudTable } from "@/components/MockCrudTable";

const columns = [
  { key: "admin", label: "Admin" },
  { key: "institute", label: "Institute" },
  { key: "status", label: "Status" },
  { key: "since", label: "Since" },
];

const rows = [
  { admin: "Dr. Faisal Malik", institute: "Al-Noor Academy", status: "Active", since: "2024-11-12" },
  { admin: "Ms. Priya Sharma", institute: "Bright Future School", status: "Active", since: "2025-02-07" },
  { admin: "Mr. James Okonkwo", institute: "Unity College", status: "Pending", since: "2026-04-19" },
];

const chart = {
  title: "Admin Onboarding",
  xKey: "month",
  yKey: "count",
  data: [
    { month: "Jan", count: 2 },
    { month: "Feb", count: 3 },
    { month: "Mar", count: 4 },
    { month: "Apr", count: 4 },
    { month: "May", count: 5 },
  ],
};

export default function Page() {
  return (
    <MockCrudTable
      title="Admins"
      description="Manage platform administrator access."
      columns={columns}
      initialRows={rows}
      chart={chart}
    />
  );
}
