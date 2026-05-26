import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Setting", "Value"];
const rows = [
  ["Attendance Alerts", "Enabled"],
  ["Report Schedule", "Weekly"],
  ["Notification Channel", "Email"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Settings"
      description="Manage manager preferences and permissions."
      columns={columns}
      rows={rows}
    />
  );
}
