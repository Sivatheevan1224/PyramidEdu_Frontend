import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Student", "Institute", "Grade", "Status"];
const rows = [
  ["N. Priyanka", "Bright Future School", "G10", "Active"],
  ["T. Rajan", "Unity College", "G12", "Active"],
  ["S. Kavya", "Al-Noor Academy", "G9", "Pending"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Students"
      description="Monitor student enrollment across institutes."
      columns={columns}
      rows={rows}
    />
  );
}
