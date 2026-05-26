import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Report", "Period", "Generated", "Status"];
const rows = [
  ["Attendance Summary", "May 2026", "2026-05-21", "Ready"],
  ["Marks Overview", "Term 1", "2026-05-12", "Ready"],
  ["Fee Collection", "Apr 2026", "2026-05-03", "Queued"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Reports"
      description="Generate institute reports and exports."
      columns={columns}
      rows={rows}
    />
  );
}
