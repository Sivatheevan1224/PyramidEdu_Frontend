import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Setting", "Value"];
const rows = [
  ["Default Class", "G10-A"],
  ["Grading Scale", "A-F"],
  ["Notifications", "Enabled"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Settings"
      description="Manage teacher preferences and class defaults."
      columns={columns}
      rows={rows}
    />
  );
}
