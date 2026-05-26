"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MockCrudTable } from "@/components/MockCrudTable";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const sampleAnnouncements = [
  { title: "Welcome Back", date: "2026-05-01", status: "Published", audience: "All" },
  { title: "Exam Schedule", date: "2026-05-10", status: "Published", audience: "G10-A" },
  { title: "Holiday Notice", date: "2026-05-15", status: "Draft", audience: "Teachers" },
];

const activity = [
  { day: "Mon", count: 3 }, { day: "Tue", count: 2 }, { day: "Wed", count: 4 }, { day: "Thu", count: 1 }, { day: "Fri", count: 2 },
];

export default function TeacherAnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // For now this form is local; use MockCrudTable modal for persistent CRUD.
    setTitle("");
    setMessage("");
    setAudience("All");
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "audience", label: "Audience" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Announcements" value="34" />
        <StatCard label="Published" value="28" />
        <StatCard label="Drafts" value="6" />
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Compose Announcement</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="announcement-title" className="block text-sm font-medium">Title</label>
          <input id="announcement-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />

          <label htmlFor="announcement-message" className="block text-sm font-medium">Message</label>
          <textarea id="announcement-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="w-full p-2 border rounded h-24" />

          <label htmlFor="announcement-audience" className="block text-sm font-medium">Audience</label>
          <select id="announcement-audience" value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded border px-3 py-2">
            <option>All</option>
            <option>Teachers</option>
            <option>G10-A</option>
            <option>G11-B</option>
          </select>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">Publish</button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold">Weekly Activity</h3>
        <p className="text-xs text-muted-foreground">Announcements posted per weekday</p>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="day" stroke="hsl(220 9% 46%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 46%)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)" }} />
              <Area type="monotone" dataKey="count" stroke="hsl(243 75% 59%)" fill="rgba(124,58,237,0.12)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <MockCrudTable title="Announcements" columns={columns} initialRows={sampleAnnouncements} description="Manage published and draft announcements" />
    </div>
  );
}

