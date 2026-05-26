import { MockCrudTable } from "@/components/MockCrudTable";

const columns = [
  { key: "metric", label: "Metric" },
  { key: "value", label: "Value" },
  { key: "change", label: "Change" },
];

const rows = [
  { metric: "Active Users", value: "1,284", change: "+3.2%" },
  { metric: "Monthly Revenue", value: "Rs. 1.2M", change: "+5.1%" },
  { metric: "Churn Rate", value: "2.1%", change: "-0.4%" },
  { metric: "Avg. Session", value: "6m 12s", change: "+0.6%" },
];

const chart = {
  title: "Monthly Active Users",
  xKey: "month",
  yKey: "users",
  data: [
    { month: "Jan", users: 980 },
    { month: "Feb", users: 1040 },
    { month: "Mar", users: 1120 },
    { month: "Apr", users: 1190 },
    { month: "May", users: 1284 },
  ],
};

export default function Page() {
  return (
    <MockCrudTable
      title="Analytics"
      description="Platform trends and growth metrics."
      columns={columns}
      initialRows={rows}
      chart={chart}
    />
  );
}
