import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Student", "Class", "Attendance", "Status"];
const rows = [
  ["N. Priyanka", "G10-A", "96%", "Active"],
  ["T. Rajan", "G11-B", "90%", "Active"],
  ["S. Kavya", "G9-C", "98%", "Active"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Students"
      description="View enrolled students and attendance insights."
      columns={columns}
      rows={rows}
    />
  );
}
