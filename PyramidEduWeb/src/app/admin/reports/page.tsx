import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reportCards = [
  { title: "Monthly Usage", subtitle: "Active users & sessions", action: "Generate" },
  { title: "Revenue Summary", subtitle: "Billing overview", action: "Download" },
  { title: "Institute Health", subtitle: "Engagement & churn", action: "Generate" },
];

const rows = [
  { report: "Monthly Usage", period: "Apr 2026", generated: "2026-05-01", status: "Ready" },
  { report: "Revenue Summary", period: "Q1 2026", generated: "2026-04-10", status: "Ready" },
  { report: "User Activity", period: "May 2026", generated: "2026-05-22", status: "Queued" },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Reports</h2>
        <p className="text-sm text-muted-foreground">Export platform activity and institute summaries.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reportCards.map((card) => (
          <Card key={card.title} className="p-4">
            <p className="font-semibold text-foreground">{card.title}</p>
            <p className="text-sm text-muted-foreground">{card.subtitle}</p>
            <Button variant="outline" className="mt-4">
              {card.action}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Report</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Period</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Generated</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.report}-${row.period}`} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{row.report}</td>
                <td className="px-4 py-3 text-foreground">{row.period}</td>
                <td className="px-4 py-3 text-foreground">{row.generated}</td>
                <td className="px-4 py-3 text-foreground">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
