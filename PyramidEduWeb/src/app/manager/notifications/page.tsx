import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Message", "Audience", "Date", "Status"];
const rows = [
  ["Parent Meeting", "Parents", "2026-05-19", "Sent"],
  ["Exam Schedule", "Students", "2026-05-16", "Scheduled"],
  ["Staff Briefing", "Teachers", "2026-05-12", "Sent"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Notifications"
      description="Manage institute announcements and alerts."
      columns={columns}
      rows={rows}
    />
  );
}
