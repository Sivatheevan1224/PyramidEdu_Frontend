"use client";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const batchOptions = Array.from({ length: 5 }, (_, i) => `${new Date().getFullYear() + i} A/L`).concat(["Other"]);
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import UploadNotes, { NoteUploadPayload } from "./UploadNotes";
import { Layers3, CalendarDays, BookOpen, FileText } from "lucide-react";

type NoteStatus = "Published" | "Draft" | "Pending Review";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";
type TeacherNote = NoteUploadPayload & {
  id: string;
  uploaded: string;
  status: NoteStatus;
};

const getStatusVariant = (status: NoteStatus) => {
  switch (status) {
    case "Published":
      return "default";
    case "Draft":
      return "secondary";
    default:
      return "outline";
  }
};




export default function Page() {
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const { user } = useAuth();
  const assignedSubject = user?.subject ?? "";
  const [notes, setNotes] = useState<TeacherNote[]>([]);
  // notes state will be loaded dynamically; start empty

  const visibleNotes = useMemo(
    () => (selectedBatch ? notes.filter((note) => note.batch === selectedBatch) : notes),
    [notes, selectedBatch],
  );

  const filteredStats = [
    {
      name: "Published",
      value: visibleNotes.filter((f) => f.status === "Published").length,
      fill: "#7C3AED",
    },
    {
      name: "Draft",
      value: visibleNotes.filter((f) => f.status === "Draft").length,
      fill: "#06B6D4",
    },
    {
      name: "Pending Review",
      value: visibleNotes.filter((f) => f.status === "Pending Review").length,
      fill: "#F59E0B",
    },
  ];

  // Use the generated future batch options for UI dropdown and badge
  const batches = batchOptions;  
  const totalFiles = visibleNotes.reduce((count, note) => count + note.files.length, 0);

  const handleNoteSubmit = (note: NoteUploadPayload) => {
    const uploaded = new Date().toISOString().slice(0, 10);
    setNotes((prev) => [
      {
        ...note,
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
        uploaded,
        status: "Pending Review",
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 bg-linear-to-br from-background to-muted/20 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Teacher dashboard
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Notes upload for your subject and A/L batch</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Your subject is fixed to your teacher profile. Choose the batch, then upload lesson notes, worksheets, and revision packs as PDF or Word files.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-2 px-3 py-1.5">
              <Layers3 className="h-3.5 w-3.5" />
              {notes.length} notes
            </Badge>
            <Badge variant="outline" className="gap-2 px-3 py-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {batchOptions.length} batches
            </Badge>
            <Badge variant="outline" className="gap-2 px-3 py-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {assignedSubject}
            </Badge>
            <Badge variant="outline" className="gap-2 px-3 py-1.5">
              <FileText className="h-3.5 w-3.5" />
              {totalFiles} files
            </Badge>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <label htmlFor="batch" className="text-sm font-medium text-muted-foreground">
            Filter by batch:
          </label>
          <select
            id="batch"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">All batches</option>
            {batches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Notes" value={visibleNotes.length.toString()} accent="primary" />
        <StatCard label="Published" value={filteredStats[0].value.toString()} />
        <StatCard label="Pending review" value={filteredStats[2].value.toString()} accent="warning" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Materials Overview</h3>
        <p className="text-xs text-muted-foreground">Distribution by status for the selected batch</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={filteredStats}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <UploadNotes
        subject={assignedSubject}
        teacherName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
        onSubmit={handleNoteSubmit}
      />

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Uploaded notes</h3>
            <p className="text-sm text-muted-foreground">Subject, batch, file count, and current publishing state.</p>
          </div>
          <Badge variant="secondary">{visibleNotes.length} visible</Badge>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Batch</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Files</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Uploaded</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleNotes.map((note) => (
                <tr key={note.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{note.title}</p>
                      <p className="text-xs text-muted-foreground">{note.description || "No description provided."}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{note.subject}</td>
                  <td className="px-4 py-3 text-foreground">{note.batch}</td>
                  <td className="px-4 py-3 text-foreground">
                    {note.files.length} file{note.files.length > 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 text-foreground">{note.uploaded}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusVariant(note.status)}>
                      {note.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
