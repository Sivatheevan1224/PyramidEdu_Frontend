import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Class", "Subject", "Avg", "Top Score"];
const rows = [
  ["G10-A", "Math", "78%", "96%"],
  ["G11-B", "Science", "74%", "93%"],
  ["G9-C", "English", "81%", "98%"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Marks"
      description="Review grading summaries and performance trends."
      columns={columns}
      rows={rows}
    />
  );
}
