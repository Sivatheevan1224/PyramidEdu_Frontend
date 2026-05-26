import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Session", "Class", "Date", "Status"];
const rows = [
  ["Morning Check", "G10-A", "2026-05-24", "Closed"],
  ["Lab Attendance", "G11-B", "2026-05-23", "Closed"],
  ["Evening Check", "G9-C", "2026-05-24", "Open"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="QR Attendance"
      description="Manage QR attendance sessions and logs."
      columns={columns}
      rows={rows}
    />
  );
}
