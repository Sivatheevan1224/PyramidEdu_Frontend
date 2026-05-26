import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Subjects", value: "4" },
  { label: "Classes", value: "6" },
  { label: "Status", value: "Active" },
];

const details = [
  { label: "Name", value: "P. Sharma" },
  { label: "Email", value: "teacher@pyramidedu.com" },
  { label: "Phone", value: "+91 98888 11111" },
  { label: "Department", value: "Senior Secondary" },
];

const activity = [
  { event: "Uploaded quiz marks", time: "Today, 08:40" },
  { event: "Marked attendance", time: "Yesterday, 09:10" },
  { event: "Shared class notes", time: "May 23" },
];

export default function Page() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">Teacher account details, workload, and recent activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="p-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-lg font-semibold">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Profile Details</h3>
              <p className="text-sm text-muted-foreground">Clear, aligned teacher identity section.</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label} className="rounded-xl border border-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="mt-2 font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="mb-4 text-sm text-muted-foreground">Most recent teaching actions and updates.</p>
          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item.event} className="border-l-2 border-primary/60 pl-3">
                <p className="text-sm font-medium text-foreground">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
