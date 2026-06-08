import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const preferences = [
  { label: "Attendance Alerts", value: "Enabled", note: "Notify guardians after 2 absences" },
  { label: "Report Schedule", value: "Weekly", note: "Auto-send every Friday at 5 PM" },
  { label: "Notification Channel", value: "Email + SMS", note: "Preferred for manager updates" },
  { label: "Data Backup", value: "Daily", note: "Nightly sync to storage" },
];

const permissions = [
  { name: "Can approve fee requests", status: "Yes" },
  { name: "Can edit announcements", status: "Yes" },
  { name: "Can manage teachers", status: "Limited" },
  { name: "Can export reports", status: "Yes" },
];

const auditLog = [
  { action: "Updated attendance alert threshold", when: "Today, 10:10 AM" },
  { action: "Changed report delivery day", when: "Yesterday, 4:40 PM" },
  { action: "Enabled SMS fallback", when: "May 23, 2026" },
];

export default function Page() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure manager preferences, permissions, and delivery rules.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Manager Preferences</h3>
              <p className="text-sm text-muted-foreground">Aligned defaults for notifications and reporting.</p>
            </div>
            <Button>Save Changes</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-foreground">
              Name
              <input
                defaultValue="A. Kumar"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-foreground">
              Role
              <input
                defaultValue="Manager"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-foreground">
              Notification Email
              <input
                defaultValue="manager@pyramidedu.edu"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-foreground">
              Backup Contact
              <input
                defaultValue="+91 98765 43210"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Preference</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {preferences.map((item) => (
                  <tr key={item.label} className="border-t border-border">
                    <td className="px-4 py-4 font-medium text-foreground">{item.label}</td>
                    <td className="px-4 py-4 text-muted-foreground">{item.value}</td>
                    <td className="px-4 py-4 text-muted-foreground">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold">Access & Permissions</h3>
            <p className="mb-4 text-sm text-muted-foreground">Controls aligned to manager responsibilities.</p>
            <div className="space-y-3">
              {permissions.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-lg font-semibold">Recent Audit</h3>
            <p className="mb-4 text-sm text-muted-foreground">Last saved changes and updates.</p>
            <div className="space-y-4">
              {auditLog.map((entry) => (
                <div key={entry.action} className="border-l-2 border-primary/60 pl-3">
                  <p className="text-sm font-medium text-foreground">{entry.action}</p>
                  <p className="text-xs text-muted-foreground">{entry.when}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}