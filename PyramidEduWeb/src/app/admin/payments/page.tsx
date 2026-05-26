import { MockCrudTable } from "@/components/MockCrudTable";

const columns = [
  { key: "institute", label: "Institute" },
  { key: "plan", label: "Plan" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

const rows = [
  { institute: "Bright Future School", plan: "Pro", amount: "Rs. 48,000", status: "Paid" },
  { institute: "Unity College", plan: "Standard", amount: "Rs. 30,000", status: "Pending" },
  { institute: "Al-Noor Academy", plan: "Pro", amount: "Rs. 48,000", status: "Paid" },
];

const chart = {
  title: "Monthly Billing",
  xKey: "month",
  yKey: "amount",
  data: [
    { month: "Jan", amount: 420000 },
    { month: "Feb", amount: 470000 },
    { month: "Mar", amount: 430000 },
    { month: "Apr", amount: 510000 },
    { month: "May", amount: 550000 },
  ],
};

export default function Page() {
  return (
    <MockCrudTable
      title="Payments Overview"
      description="Track subscriptions and institute billing activity."
      columns={columns}
      initialRows={rows}
      chart={chart}
    />
  );
}
