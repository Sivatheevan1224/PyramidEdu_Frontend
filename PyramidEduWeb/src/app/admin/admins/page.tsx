import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Admin", "Institute", "Status", "Since"];
const rows = [
  ["Dr. Faisal Malik", "Al-Noor Academy", "Active", "2024-11-12"],
  ["Ms. Priya Sharma", "Bright Future School", "Active", "2025-02-07"],
  ["Mr. James Okonkwo", "Unity College", "Pending", "2026-04-19"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Admins"
      description="Manage platform administrator access."
      columns={columns}
      rows={rows}
    />
  );
}
