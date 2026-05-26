import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Scheduled", value: "12" },
  { label: "Sent Today", value: "8" },
  { label: "Audience Reach", value: "1.2k" },
];

const notifications = [
  {
    title: "Parent Meeting Reminder",
    audience: "Parents",
    date: "2026-05-26",
    status: "Scheduled",
    tone: "amber",
  },
  {
    title: "Exam Schedule Released",
    audience: "Students",
    date: "2026-05-24",
    status: "Sent",
    tone: "emerald",
  },
  {
    title: "Staff Briefing Notes",
    audience: "Teachers",
    date: "2026-05-22",
    status: "Draft",
    tone: "slate",
  },
  {
    title: "Fee Window Opening",
    audience: "Managers",
    date: "2026-05-21",
    status: "Sent",
    tone: "emerald",
  },
];

const timeline = [
  { time: "10:30 AM", title: "Scheduled", note: "Parent meeting reminder queued for Friday" },
  { time: "09:10 AM", title: "Sent", note: "Exam schedule pushed to all students" },
  { time: "Yesterday", title: "Draft", note: "Fee window message updated by manager" },
];

const toneClasses: Record<string, string> = {
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function Page() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Track audience messages, scheduled alerts, and recent broadcast activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="p-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Notification Queue</h3>
              <p className="text-sm text-muted-foreground">Clean view of broadcasts by audience and status.</p>
            </div>
            <Button>New Notification</Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Audience</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((item) => (
                  <tr key={item.title} className="border-t border-border">
                    <td className="px-4 py-4 font-medium text-foreground">{item.title}</td>
                    <td className="px-4 py-4 text-muted-foreground">{item.audience}</td>
                    <td className="px-4 py-4 text-muted-foreground">{item.date}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${toneClasses[item.tone]}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold">Activity Timeline</h3>
          <p className="mb-4 text-sm text-muted-foreground">Most recent delivery and drafting actions.</p>
          <div className="space-y-4">
            {timeline.map((item) => (
              <div key={item.time + item.title} className="flex gap-3 rounded-xl border border-border p-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="shrink-0 text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}