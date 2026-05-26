import { MockCrudTable } from "@/components/MockCrudTable";

const columns = [
  { key: "title", label: "Title" },
  { key: "audience", label: "Audience" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

const rows = [
  { title: "System Maintenance", audience: "All Users", date: "2026-05-20", status: "Scheduled" },
  { title: "New Features", audience: "Teachers", date: "2026-05-18", status: "Published" },
  { title: "Payment Reminder", audience: "Managers", date: "2026-05-14", status: "Draft" },
];

export default function Page() {
  return (
    <MockCrudTable
      title="Announcements"
      description="Broadcast updates to staff and students."
      columns={columns}
      initialRows={rows}
    />
  );
}
