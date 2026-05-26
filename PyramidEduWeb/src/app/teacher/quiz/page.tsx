import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Quiz", "Class", "Due Date", "Status"];
const rows = [
  ["Chapter 3", "G10-A", "2026-05-30", "Draft"],
  ["Algebra", "G11-B", "2026-05-28", "Published"],
  ["Grammar", "G9-C", "2026-05-26", "Published"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Quiz"
      description="Create and review class quizzes."
      columns={columns}
      rows={rows}
    />
  );
}
