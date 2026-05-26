import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["Report", "Period", "Generated", "Status"];
const rows = [
  ["Monthly Usage", "Apr 2026", "2026-05-01", "Ready"],
  ["Revenue Summary", "Q1 2026", "2026-04-10", "Ready"],
  ["User Activity", "May 2026", "2026-05-22", "Queued"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Reports"
      description="Export platform activity and institute summaries."
      columns={columns}
      rows={rows}
    />
  );
}
