import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Student", "Assessment", "Score", "Grade"];
const rows = [
  ["N. Priyanka", "Quiz 2", "88%", "A"],
  ["T. Rajan", "Quiz 2", "74%", "B"],
  ["S. Kavya", "Quiz 2", "91%", "A"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Marks"
      description="Review class marks and grading history."
      columns={columns}
      rows={rows}
    />
  );
}
