import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Exam", "Class", "Date", "Status"];
const rows = [
  ["Midterm", "G10-A", "2026-06-05", "Scheduled"],
  ["Unit Test", "G11-B", "2026-05-29", "Scheduled"],
  ["Revision", "G9-C", "2026-05-27", "Draft"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Exams"
      description="Create and review exams for your classes."
      columns={columns}
      rows={rows}
    />
  );
}
