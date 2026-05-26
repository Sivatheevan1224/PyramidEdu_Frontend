import { SimpleTableCard } from "@/components/SimpleTableCard";

const columns = ["File", "Class", "Uploaded", "Status"];
const rows = [
  ["Chapter 4 Notes.pdf", "G10-A", "2026-05-20", "Published"],
  ["Lab Guide.pdf", "G11-B", "2026-05-18", "Published"],
  ["Essay Tips.pdf", "G9-C", "2026-05-16", "Draft"],
];

export default function Page() {
  return (
    <SimpleTableCard
      title="Notes"
      description="Upload and manage study materials."
      columns={columns}
      rows={rows}
    />
  );
}
