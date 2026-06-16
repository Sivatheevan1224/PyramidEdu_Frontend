"use client";

import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { UploadNotes } from "../components/UploadNotes";
import { Layers3, CalendarDays, BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";
import { TeacherNote, NoteStatus } from "../types";
import * as notesApi from "../services/notes.api";

const batchOptions = Array.from({ length: 5 }, (_, i) => `${new Date().getFullYear() + i} A/L`).concat(["Other"]);

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

export function NotesPage() {
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const { user } = useAuth();
  const assignedSubject = user?.subject ?? "";
  const assignedSubjectId = user?.subjectId ?? "";
  const [notes, setNotes] = useState<TeacherNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotesList = async () => {
    try {
      setIsLoading(true);
      const res = await notesApi.fetchNotes();
      if (res?.success) {
        const mappedNotes = res.data.map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.text || "",
          batch: m.batch || "Unknown",
          subject: m.subject?.subjectName || "",
          files: m.fileUrls || [],
          uploaded: new Date(m.uploadedAt).toISOString().slice(0, 10),
          status: m.status || "Pending Review",
        }));
        setNotes(mappedNotes);
      }
    } catch (error) {
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotesList();
  }, []);

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

  const batches = batchOptions;  
  const totalFiles = visibleNotes.reduce((count, note) => count + note.files.length, 0);

  const [editingNote, setEditingNote] = useState<TeacherNote | null>(null);
  const [editFiles, setEditFiles] = useState<File[]>([]);

  const handleNoteSubmit = async (formData: FormData) => {
    try {
      toast.loading("Uploading notes...", { id: "upload-note" });
      const res = await notesApi.createNote(formData);
      if (res?.success) {
        toast.success("Notes uploaded successfully", { id: "upload-note" });
        fetchNotesList();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to upload notes", { id: "upload-note" });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    try {
      toast.loading("Updating note...", { id: "edit-note" });
      const formData = new FormData();
      formData.append("title", editingNote.title);
      formData.append("text", editingNote.description || "");
      formData.append("batch", editingNote.batch);
      formData.append("status", editingNote.status);
      
      editFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await notesApi.updateNote(editingNote.id, formData);
      
      if (res?.success) {
        toast.success("Note updated successfully", { id: "edit-note" });
        setEditingNote(null);
        setEditFiles([]);
        fetchNotesList();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update note", { id: "edit-note" });
    }
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
        subjectId={assignedSubjectId}
        teacherName={user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
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
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
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
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-sm font-medium text-primary hover:underline"
                      onClick={() => setEditingNote(note)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal (Native Overlay) */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl relative">
            <button
              onClick={() => { setEditingNote(null); setEditFiles([]); }}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h3 className="text-xl font-semibold mb-4">Edit Note</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Batch</label>
                <select
                  value={editingNote.batch}
                  onChange={(e) => setEditingNote({ ...editingNote, batch: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {batches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={editingNote.status}
                  onChange={(e) => setEditingNote({ ...editingNote, status: e.target.value as any })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={editingNote.description}
                  onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Attached Files</label>
                {editingNote.files && editingNote.files.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-primary">
                    {editingNote.files.map((file, i) => {
                      const baseUrl = "http://localhost:5000"; 
                      const fileUrl = file.startsWith("http") ? file : `${baseUrl}${file}`;
                      return (
                        <li key={i}>
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                            {file.split('/').pop() || file}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No files attached.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Add New Files</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={(e) => {
                    if (e.target.files) {
                      setEditFiles(Array.from(e.target.files));
                    }
                  }}
                  className="w-full text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setEditingNote(null); setEditFiles([]); }}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
