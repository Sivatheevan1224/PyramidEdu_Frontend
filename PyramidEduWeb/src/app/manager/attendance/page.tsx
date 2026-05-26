import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Date", "Class", "Present", "Absent"];
const rows = [
  ["2026-05-24", "G10-A", "28", "2"],
  ["2026-05-24", "G11-B", "25", "5"],
  ["2026-05-24", "G9-C", "30", "0"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Attendance"
      description="Track daily attendance and absence trends."
      columns={columns}
      rows={rows}
    />
  );
}
