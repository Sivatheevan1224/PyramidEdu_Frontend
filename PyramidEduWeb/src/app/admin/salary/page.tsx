import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Staff", "Role", "Amount", "Status"];
const rows = [
  ["S. Makinthan", "Teacher", "Rs. 120,000", "Approved"],
  ["A. Sivatheevan", "Manager", "Rs. 150,000", "Pending"],
  ["K. Kowsika", "Support", "Rs. 90,000", "Paid"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Salary Management"
      description="Review staff payouts and approvals."
      columns={columns}
      rows={rows}
    />
  );
}
