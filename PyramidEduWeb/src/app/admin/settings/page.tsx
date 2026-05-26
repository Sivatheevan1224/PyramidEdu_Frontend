"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";

const audit = [
  { action: "Auto Billing Enabled", by: "Admin", date: "2026-05-20" },
  { action: "Support SLA Updated", by: "Admin", date: "2026-05-16" },
  { action: "Default Plan Changed", by: "Admin", date: "2026-05-12" },
];

export default function Page() {
  const [defaultPlan, setDefaultPlan] = useState("Standard");
  const [supportSla, setSupportSla] = useState("24 hours");
  const [autoBilling, setAutoBilling] = useState(true);

  const columns = [
    { key: "action", label: "Action" },
    { key: "by", label: "By" },
    { key: "date", label: "Date" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active Plan" value={defaultPlan} />
        <StatCard label="Support SLA" value={supportSla} />
        <StatCard label="Auto Billing" value={autoBilling ? "On" : "Off"} />
      </div>

      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage platform preferences and access rules.</p>
      </div>

      <Card className="p-4">
        <p className="text-sm font-semibold mb-3">Platform Preferences</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="default-plan" className="text-sm font-medium text-foreground">Default Plan</label>
            <select id="default-plan" value={defaultPlan} onChange={(e) => setDefaultPlan(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option>Standard</option>
              <option>Pro</option>
            </select>
          </div>

          <div>
            <label htmlFor="support-sla" className="text-sm font-medium text-foreground">Support SLA</label>
            <select id="support-sla" value={supportSla} onChange={(e) => setSupportSla(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option>24 hours</option>
              <option>48 hours</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input id="auto-billing" aria-label="Auto Billing" type="checkbox" className="h-4 w-4" checked={autoBilling} onChange={(e) => setAutoBilling(e.target.checked)} />
            <label htmlFor="auto-billing" className="select-none">Auto Billing Enabled</label>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => { /* placeholder: persist settings */ }}>Save Changes</Button>
        </div>
      </Card>

      <MockCrudTable title="Audit Log" description="Recent platform changes" columns={columns} initialRows={audit} />
    </div>
  );
}
