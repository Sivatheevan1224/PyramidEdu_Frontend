import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Teacher", "Institute", "Subject", "Status"];
const rows = [
  ["P. Sharma", "Bright Future School", "Mathematics", "Active"],
  ["J. Okonkwo", "Unity College", "Science", "Active"],
  ["F. Malik", "Al-Noor Academy", "English", "Pending"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Teachers"
      description="Review teacher profiles and assignments."
      columns={columns}
      rows={rows}
    />
  );
}
