"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";

const initialSettings = [
  { setting: "Default Class", value: "G10-A" },
  { setting: "Grading Scale", value: "A-F" },
  { setting: "Notifications", value: "Enabled" },
];

export default function Page() {
  const [defaultClass, setDefaultClass] = useState("G10-A");
  const [gradingScale, setGradingScale] = useState("A-F");
  const [notifications, setNotifications] = useState(true);

  const columns = [
    { key: "setting", label: "Setting" },
    { key: "value", label: "Value" },
  ];

  const handleSave = (e: any) => {
    e.preventDefault();
    // saved locally for now
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Default Class" value={defaultClass} />
        <StatCard label="Grading Scale" value={gradingScale} />
        <StatCard label="Notifications" value={notifications ? "On" : "Off"} />
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Preferences</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="default-class" className="block text-sm font-medium">Default Class</label>
            <select id="default-class" value={defaultClass} onChange={(e) => setDefaultClass(e.target.value)} className="mt-2 w-full rounded border px-3 py-2">
              <option>G9-C</option>
              <option>G10-A</option>
              <option>G11-B</option>
            </select>
          </div>

          <div>
            <label htmlFor="grading-scale" className="block text-sm font-medium">Grading Scale</label>
            <select id="grading-scale" value={gradingScale} onChange={(e) => setGradingScale(e.target.value)} className="mt-2 w-full rounded border px-3 py-2">
              <option>A-F</option>
              <option>1-10</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input id="notifications" type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            <label htmlFor="notifications" className="text-sm">Enable notifications</label>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">Save</button>
          </div>
        </form>
      </Card>

      <MockCrudTable title="Settings Audit" columns={columns} initialRows={initialSettings} description="Audit of recent changes" />
    </div>
  );
}
