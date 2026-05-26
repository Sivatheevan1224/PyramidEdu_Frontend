import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Student", "Class", "Guardian", "Status"];
const rows = [
  ["N. Priyanka", "G10-A", "S. Priya", "Active"],
  ["T. Rajan", "G11-B", "K. Rajan", "Active"],
  ["S. Kavya", "G9-C", "R. Kavya", "Pending"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Students"
      description="View and manage student records."
      columns={columns}
      rows={rows}
    />
  );
}
