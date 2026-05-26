import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Field", "Value"];
const rows = [
  ["Name", "A. Sivatheevan"],
  ["Email", "manager@pyramidedu.com"],
  ["Role", "Manager"],
  ["Status", "Active"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Profile"
      description="Account information for this manager profile."
      columns={columns}
      rows={rows}
    />
  );
}
