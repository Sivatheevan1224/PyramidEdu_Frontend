import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Field", "Value"];
const rows = [
  ["Name", "P. Sharma"],
  ["Email", "teacher@pyramidedu.com"],
  ["Role", "Teacher"],
  ["Status", "Active"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Profile"
      description="Account information for this teacher profile."
      columns={columns}
      rows={rows}
    />
  );
}
