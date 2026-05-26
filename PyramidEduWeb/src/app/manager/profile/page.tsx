import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Department", value: "Operations" },
  { label: "Role", value: "Manager" },
  { label: "Status", value: "Active" },
];

const details = [
  { label: "Name", value: "A. Sivatheevan" },
  { label: "Email", value: "manager@pyramidedu.com" },
  { label: "Phone", value: "+91 90000 00001" },
  { label: "Location", value: "Main Campus" },
];

const activity = [
  { event: "Reviewed attendance summary", time: "Today, 08:55" },
  { event: "Approved report schedule", time: "Yesterday, 17:20" },
  { event: "Updated notification rules", time: "May 23" },
];

export default function Page() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">Manager identity, permissions, and recent activity.</p>
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
              <p className="text-sm text-muted-foreground">Aligned details for the manager account.</p>
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
          <p className="mb-4 text-sm text-muted-foreground">Latest manager actions and approvals.</p>
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
