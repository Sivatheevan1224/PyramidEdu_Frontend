import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Field", "Value"];
const rows = [
  ["Name", "Dr. Faisal Malik"],
  ["Email", "admin@pyramidedu.com"],
  ["Role", "Admin"],
  ["Status", "Active"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Profile"
      description="Account information for this admin profile."
      columns={columns}
      rows={rows}
    />
  );
}
