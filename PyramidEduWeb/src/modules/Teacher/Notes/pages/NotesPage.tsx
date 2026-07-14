"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Search, Calendar, FileText, Download, Edit, Trash2, BookOpen, Layers3, X, AlertTriangle, 
  ExternalLink, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { TeacherNote } from "../types";
import * as notesApi from "../services/notes.api";
import { api } from "@/lib/api";

/* ─────────────────────────── Delete Confirmation Modal ─────────────────────────── */
interface DeleteConfirmModalProps {
  noteTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmModal({ noteTitle, onConfirm, onCancel, isDeleting }: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-6 pb-4 px-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            Delete Study Material?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
            Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">"{noteTitle}"</span>? This action will permanently remove it and cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            className="flex-1 h-10 rounded-xl text-xs font-semibold"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold cursor-pointer"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function NotesPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const assignedSubject = user?.subject ?? "";
  
  const [notes, setNotes] = useState<TeacherNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [batches, setBatches] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  // Modals / Actions State
  const [editingNote, setEditingNote] = useState<TeacherNote | null>(null);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [noteToDelete, setNoteToDelete] = useState<TeacherNote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchNotesList = async () => {
    try {
      setIsLoading(true);
      const res = await notesApi.fetchNotes();
      if (res?.success) {
        const mappedNotes = res.data.map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.text || "",
          batch: m.batch || "All Batches",
          subject: m.subject?.subjectName || "",
          files: m.fileUrls || [],
          uploaded: new Date(m.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
          status: m.status || "Published",
        }));
        setNotes(mappedNotes);

        // Extract dynamic subjects for filter dropdowns
        const uniqueSubjects: string[] = Array.from(new Set(mappedNotes.map((n: any) => n.subject))).filter(Boolean) as string[];
        setSubjects(uniqueSubjects);
      }
    } catch (error) {
      toast.error("Failed to load study materials");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await api.get("/batches?activeOnly=true");
      const payload = res.data;
      let batchList: { id: string; batchName: string }[] = [];
      if (Array.isArray(payload?.data)) {
        batchList = payload.data;
      } else if (Array.isArray(payload)) {
        batchList = payload;
      }
      setBatches(batchList.map(b => b.batchName));
    } catch (err) {
      console.error("Failed to load batches", err);
    }
  };

  useEffect(() => {
    fetchNotesList();
    fetchBatches();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    setIsUpdating(true);
    const toastId = toast.loading("Updating study material...");
    try {
      const formData = new FormData();
      formData.append("title", editingNote.title);
      formData.append("text", editingNote.description || "");
      formData.append("batch", editingNote.batch);
      
      editFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await notesApi.updateNote(editingNote.id, formData);
      
      if (res?.success) {
        toast.success("Study material updated successfully", { id: toastId });
        setEditingNote(null);
        setEditFiles([]);
        fetchNotesList();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update study material", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting study material...");
    try {
      await notesApi.deleteNote(noteToDelete.id);
      toast.success("Study material deleted successfully", { id: toastId });
      setNoteToDelete(null);
      fetchNotesList();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete study material", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            note.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBatch = selectedBatch ? note.batch === selectedBatch : true;
      const matchesSubject = selectedSubject ? note.subject === selectedSubject : true;
      return matchesSearch && matchesBatch && matchesSubject;
    });
  }, [notes, searchQuery, selectedBatch, selectedSubject]);

  const handleDownload = (files: string[]) => {
    if (files.length === 0) {
      toast.error("No files attached to this study material");
      return;
    }
    const baseUrl = "http://localhost:5000"; 
    files.forEach((file) => {
      const url = file.startsWith("http") ? file : `${baseUrl}${file}`;
      window.open(url, "_blank");
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Study Materials & Notes</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and distribute educational notes, handouts, and slides to your classes.</p>
        </div>
        <div>
          <Button 
            onClick={() => router.push("/teacher/notes/upload")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload Notes
          </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl"
          />
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-10 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl px-3 text-sm text-slate-600 dark:text-slate-300 w-full md:w-44 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {/* Batch Filter */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="h-10 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl px-3 text-sm text-slate-600 dark:text-slate-300 w-full md:w-44 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Batches</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid / Cards view */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading study materials...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/20 max-w-xl mx-auto p-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center mx-auto mb-4 border border-indigo-100/30">
            <FileText className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Study Materials Found</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            {searchQuery || selectedBatch || selectedSubject 
              ? "We couldn't find any materials matching your search criteria. Try removing filters."
              : "You haven't uploaded any study materials yet. Click 'Upload Notes' to get started."}
          </p>
          {(searchQuery || selectedBatch || selectedSubject) && (
            <Button
              variant="outline"
              onClick={() => { setSearchQuery(""); setSelectedBatch(""); setSelectedSubject(""); }}
              className="mt-5 rounded-xl border-slate-200 font-semibold cursor-pointer"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        /* Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              className="group overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-md transition-all hover:border-slate-350 dark:hover:border-slate-700 flex flex-col justify-between"
            >
              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Meta Labels */}
                <div className="flex items-center flex-wrap gap-2">
                  <Badge className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-none font-bold text-[10px] rounded-lg tracking-wide uppercase px-2 py-0.5 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {note.subject}
                  </Badge>
                  <Badge className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none font-bold text-[10px] rounded-lg tracking-wide px-2 py-0.5 dark:bg-slate-850 dark:text-slate-300">
                    {note.batch}
                  </Badge>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {note.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Card Footer (Metadata & Actions) */}
              <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {note.uploaded}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {note.files.length} {note.files.length === 1 ? "file" : "files"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(note.files)}
                    className="flex-1 rounded-xl text-xs font-bold border-slate-200/80 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/20 text-slate-600 dark:text-slate-300 cursor-pointer h-9"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    View / Download
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingNote(note)}
                    className="rounded-xl border border-slate-200/80 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/20 cursor-pointer w-9 h-9 shrink-0"
                    title="Edit Note"
                  >
                    <Edit className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setNoteToDelete(note)}
                    className="rounded-xl border border-slate-200/80 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 cursor-pointer w-9 h-9 shrink-0"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <DeleteConfirmModal 
          noteTitle={noteToDelete.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isDeleting && setNoteToDelete(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* Edit Modal (Native Overlay) */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => { setEditingNote(null); setEditFiles([]); }}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-5">Edit Study Material</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">Title</label>
                <Input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full border-slate-200 rounded-xl h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">Batch</label>
                <select
                  value={editingNote.batch}
                  onChange={(e) => setEditingNote({ ...editingNote, batch: e.target.value })}
                  className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl px-3 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All Batches">All Batches</option>
                  {batches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">Description</label>
                <Textarea
                  value={editingNote.description}
                  onChange={(e: any) => setEditingNote({ ...editingNote, description: e.target.value })}
                  rows={4}
                  className="w-full border-slate-200 rounded-xl min-h-24 resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block font-bold">Attached Files</label>
                {editingNote.files && editingNote.files.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {editingNote.files.map((file, i) => {
                      const baseUrl = "http://localhost:5000"; 
                      const fileUrl = file.startsWith("http") ? file : `${baseUrl}${file}`;
                      return (
                        <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg">
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-xs">{file.split('/').pop() || file}</span>
                          <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[11px] font-bold text-indigo-500 hover:text-indigo-600 inline-flex items-center gap-1 shrink-0"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No files attached.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">Attach Additional Files</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.pptx,.ppt,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    if (e.target.files) {
                      setEditFiles(Array.from(e.target.files));
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setEditingNote(null); setEditFiles([]); }}
                  className="rounded-xl h-10 border-slate-200 font-semibold"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotesPage;
