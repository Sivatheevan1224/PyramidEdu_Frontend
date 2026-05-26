import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Message", "Class", "Date", "Status"];
const rows = [
  ["Homework Reminder", "G10-A", "2026-05-22", "Sent"],
  ["Quiz Update", "G11-B", "2026-05-20", "Sent"],
  ["Lab Schedule", "G9-C", "2026-05-18", "Draft"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Announcements"
      description="Post updates to your classes."
      columns={columns}
      rows={rows}
    />
  );
}
