"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MockCrudTable } from "@/components/MockCrudTable";
import { StatCard } from "@/components/StatCard";

const columns = [
  { key: "title", label: "Title" },
  { key: "audience", label: "Audience" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

const rows = [
  { title: "System Maintenance", audience: "All Users", date: "2026-05-20", status: "Scheduled" },
  { title: "New Features", audience: "Teachers", date: "2026-05-18", status: "Published" },
  { title: "Payment Reminder", audience: "Managers", date: "2026-05-14", status: "Draft" },
];

const timeline = [
  { title: "Maintenance Window", note: "Systems upgrade", time: "May 20" },
  { title: "Feature Drop", note: "New AI tools", time: "May 18" },
  { title: "Billing Notice", note: "Upcoming invoices", time: "May 14" },
];

export default function Page() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Users");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Announcements" value="34" />
        <StatCard label="Scheduled" value="3" />
        <StatCard label="Drafts" value="6" />
      </div>

      <div>
        <h2 className="text-xl font-semibold">Announcements</h2>
        <p className="text-sm text-muted-foreground">Broadcast updates to staff and students.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <p className="text-sm font-semibold mb-3">Compose Announcement</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="announcement-title" className="text-sm font-medium text-foreground">Title</label>
              <input
                id="announcement-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="announcement-audience" className="text-sm font-medium text-foreground">Audience</label>
              <select
                id="announcement-audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option>All Users</option>
                <option>Teachers</option>
                <option>Managers</option>
                <option>Students</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="announcement-message" className="text-sm font-medium text-foreground">Message</label>
            <textarea
              id="announcement-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              rows={4}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button disabled={!title || !message}>Send Announcement</Button>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold mb-3">Recent Activity</p>
          <div className="space-y-4 text-sm">
            {timeline.map((item) => (
              <div key={item.title} className="border-l-2 border-primary/60 pl-3">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-muted-foreground">{item.note}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <MockCrudTable
        title="Announcement Log"
        description="Manage draft and scheduled announcements."
        columns={columns}
        initialRows={rows}
      />
    </div>
  );
}
