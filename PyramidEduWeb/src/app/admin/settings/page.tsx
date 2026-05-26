import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Setting", "Value"];
const rows = [
  ["Default Plan", "Standard"],
  ["Auto Billing", "Enabled"],
  ["Support SLA", "24 hours"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Settings"
      description="Manage platform preferences and access rules."
      columns={columns}
      rows={rows}
    />
  );
}
