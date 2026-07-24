"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Bell,
  Trash2,
  Edit,
  Eye,
  Plus,
  Send,
  Calendar,
  AlertCircle,
  FileText,
  Upload,
  User,
  Users,
  Book,
  X,
  Search,
  Filter,
  Loader2,
  Clock,
  CheckCircle2
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  target: string;
  publishDate: string;
  expiryDate?: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED';
  attachmentUrl?: string | null;
  sender?: {
    fullName: string;
    role: string;
  };
  batches?: { id: string; batchName: string }[];
  subjects?: { id: string; subjectName: string }[];
  recipients?: { id: string; fullName: string; role: string }[];
  recipientCount?: number;
}

export default function AdminAnnouncementsPage() {
  // Lists
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Filtering & Pagination
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTarget, setFilterTarget] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Statistics
  const [stats, setStats] = useState({ total: 0, published: 0, scheduled: 0, drafts: 0 });

  // Modals state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("ALL");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED">("PUBLISHED");
  const [publishDate, setPublishDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch lists
  useEffect(() => {
    fetchAnnouncements();
    fetchSupportData();
  }, [search, filterPriority, filterStatus, filterTarget, page]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/announcements`, {
        params: {
          page,
          limit: 10,
          title: search || undefined,
          priority: filterPriority || undefined,
          status: filterStatus || undefined,
          target: filterTarget || undefined,
        }
      });
      if (data?.data) {
        setAnnouncements(data.data.data || []);
        setTotalPages(data.data.totalPages || 1);
        
        const allRes = await api.get(`/announcements?limit=100`);
        const allList: Announcement[] = allRes.data?.data?.data || [];
        setStats({
          total: allList.length,
          published: allList.filter(a => a.status === 'PUBLISHED').length,
          scheduled: allList.filter(a => a.status === 'SCHEDULED').length,
          drafts: allList.filter(a => a.status === 'DRAFT').length
        });
      }
    } catch (error) {
      console.error("Failed to load announcements", error);
      toast.error("Failed to load announcements list");
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportData = async () => {
    try {
      const batchRes = await api.get("/batches?activeOnly=true");
      setBatches(batchRes.data?.data || []);

      const subRes = await api.get("/subjects?activeOnly=true");
      setSubjects(subRes.data?.data || []);

      const userRes = await api.get("/users?limit=100");
      setUsers(userRes.data?.data?.users || []);
    } catch (error) {
      console.error("Failed to load support lists", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'essay-pdfs');

    setUploading(true);
    try {
      const { data } = await api.post('/exams/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAttachmentUrl(data.url);
      toast.success("Attachment uploaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and message content are required");
      return;
    }

    const payload = {
      title,
      content,
      target,
      priority,
      status,
      publishDate: publishDate ? new Date(publishDate).toISOString() : undefined,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
      batchIds: selectedBatchIds,
      subjectIds: selectedSubjectIds,
      userIds: selectedUserIds,
      attachmentUrl
    };

    try {
      if (editingAnnouncement) {
        await api.patch(`/announcements/${editingAnnouncement.id}`, payload);
        toast.success("Announcement updated successfully");
      } else {
        await api.post("/announcements", payload);
        toast.success("Announcement created successfully");
      }
      resetForm();
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save announcement");
    }
  };

  const handleEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setTitle(ann.title);
    setContent(ann.content);
    setTarget(ann.target);
    setPriority(ann.priority);
    setStatus(ann.status);
    setPublishDate(ann.publishDate ? new Date(ann.publishDate).toISOString().slice(0, 16) : "");
    setExpiryDate(ann.expiryDate ? new Date(ann.expiryDate).toISOString().slice(0, 16) : "");
    setSelectedBatchIds(ann.batches?.map(b => b.id) || []);
    setSelectedSubjectIds(ann.subjects?.map(s => s.id) || []);
    setSelectedUserIds(ann.recipients?.map(r => r.id) || []);
    setAttachmentUrl(ann.attachmentUrl || "");
    setIsComposeOpen(true);
  };

  const handleDelete = (id: string) => {
    setAnnouncementToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;
    try {
      await api.delete(`/announcements/${announcementToDelete}`);
      toast.success("Announcement deleted successfully");
      fetchAnnouncements();
    } catch (error) {
      toast.error("Failed to delete announcement");
    } finally {
      setIsDeleteConfirmOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  const handlePublishToggle = async (ann: Announcement) => {
    try {
      if (ann.status === 'PUBLISHED') {
        await api.patch(`/announcements/${ann.id}`, { status: 'DRAFT' });
        toast.success("Announcement returned to draft");
      } else {
        await api.patch(`/announcements/${ann.id}/publish`);
        toast.success("Announcement published successfully");
      }
      fetchAnnouncements();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleArchiveToggle = async (ann: Announcement) => {
    try {
      if (ann.status === 'ARCHIVED') {
        await api.patch(`/announcements/${ann.id}`, { status: 'PUBLISHED' });
        toast.success("Announcement restored to published");
      } else {
        await api.patch(`/announcements/${ann.id}/archive`);
        toast.success("Announcement archived successfully");
      }
      fetchAnnouncements();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const resetForm = () => {
    setIsComposeOpen(false);
    setEditingAnnouncement(null);
    setTitle("");
    setContent("");
    setTarget("ALL");
    setPriority("MEDIUM");
    setStatus("PUBLISHED");
    setPublishDate("");
    setExpiryDate("");
    setSelectedBatchIds([]);
    setSelectedSubjectIds([]);
    setSelectedUserIds([]);
    setAttachmentUrl("");
  };

  const viewDetails = async (id: string) => {
    try {
      const { data } = await api.get(`/announcements/${id}`);
      setSelectedAnnouncement(data.data);
      setIsDetailsOpen(true);
    } catch (error) {
      toast.error("Failed to load details");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system-wide broadcast notices, audience targets, and announcement history.
          </p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)} className="rounded-xl font-bold gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Compose Announcement
        </Button>
      </div>

      {/* Stats with Icons */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard label="Total Broadcasts" value={stats.total.toString()} icon={Bell} accent="primary" />
        <StatCard label="Active Published" value={stats.published.toString()} icon={Send} accent="secondary" />
        <StatCard label="Scheduled" value={stats.scheduled.toString()} icon={Clock} accent="accent" />
        <StatCard label="Drafts" value={stats.drafts.toString()} icon={FileText} accent="warning" />
      </div>

      {/* Filter and search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements by title..."
            className="pl-10 w-full h-10 rounded-xl border border-border bg-muted/20 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <select
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value)}
            className="h-10 border border-border rounded-xl px-3 text-sm bg-card text-foreground focus:outline-none cursor-pointer"
          >
            <option value="">All Targets</option>
            <option value="ALL">Everyone</option>
            <option value="TEACHER">Teachers</option>
            <option value="MANAGER">Managers</option>
            <option value="STUDENT">Students</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-10 border border-border rounded-xl px-3 text-sm bg-card text-foreground focus:outline-none cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 border border-border rounded-xl px-3 text-sm bg-card text-foreground focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Main announcements log table */}
      <Card className="overflow-hidden border border-border bg-card rounded-2xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Publisher</th>
                <th className="px-6 py-4">Audience</th>
                <th className="px-6 py-4">Recipients</th>
                <th className="px-6 py-4">Publish Date</th>
                <th className="px-6 py-4 text-center">Priority</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading announcements...</span>
                    </div>
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    No announcements matching filters found.
                  </td>
                </tr>
              ) : (
                announcements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground max-w-[220px] truncate">
                      {ann.title}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">{ann.sender?.fullName || "Admin"}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono">{ann.sender?.role || "SYSTEM"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-0.5 border border-primary/20">
                        {ann.target}
                      </span>
                      {ann.batches && ann.batches.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">Batches: {ann.batches.map(b => b.batchName).join(", ")}</p>
                      )}
                      {ann.subjects && ann.subjects.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">Subjects: {ann.subjects.map(s => s.subjectName).join(", ")}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {ann.recipientCount ?? 0} Users
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(ann.publishDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ann.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/60' :
                        ann.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/60' :
                        'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/60'
                      }`}>
                        {ann.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ann.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/60' :
                        ann.status === 'DRAFT' ? 'bg-muted text-muted-foreground border border-border' :
                        ann.status === 'SCHEDULED' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200/60' :
                        'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200/60'
                      }`}>
                        {ann.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => viewDetails(ann.id)} className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handlePublishToggle(ann)} className="h-8 px-2.5 rounded-lg text-xs font-semibold cursor-pointer">
                          {ann.status === 'PUBLISHED' ? "Unpublish" : "Publish"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleArchiveToggle(ann)} className="h-8 px-2.5 rounded-lg text-xs font-semibold text-purple-600 cursor-pointer">
                          {ann.status === 'ARCHIVED' ? "Unarchive" : "Archive"}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(ann)} className="h-8 w-8 rounded-full text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer" title="Edit Announcement">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(ann.id)} className="h-8 w-8 rounded-full text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer" title="Delete Announcement">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-muted/20">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="outline" size="sm" className="rounded-lg cursor-pointer">
              Previous
            </Button>
            <span className="text-xs text-muted-foreground font-semibold">Page {page} of {totalPages}</span>
            <Button disabled={page === totalPages} onClick={() => setPage(page + 1)} variant="outline" size="sm" className="rounded-lg cursor-pointer">
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Compose Overlay Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" /> {editingAnnouncement ? "Edit Announcement" : "Compose Broadcast Notice"}
              </h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-4 text-left">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Announcement Title *</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notice title..."
                    className="w-full h-10 px-3.5 border rounded-xl border-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full h-10 px-3.5 border rounded-xl border-border bg-card text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Notice Content *</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft notice message..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 border rounded-xl border-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Target Audience</label>
                  <select
                    value={target}
                    onChange={(e) => {
                      setTarget(e.target.value);
                      setSelectedBatchIds([]);
                      setSelectedSubjectIds([]);
                      setSelectedUserIds([]);
                    }}
                    className="w-full h-10 px-3.5 border rounded-xl border-border bg-card text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">ALL (Everyone)</option>
                    <option value="STUDENT">STUDENT (All Students)</option>
                    <option value="TEACHER">TEACHER (All Teachers)</option>
                    <option value="MANAGER">MANAGER (All Managers)</option>
                    <option value="BATCH">BATCH (Specific Batches)</option>
                    <option value="SUBJECT">SUBJECT (Specific Subjects)</option>
                    <option value="PARENT">PARENT (All Parents)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Publish Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-10 px-3.5 border rounded-xl border-border bg-card text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="PUBLISHED">Publish immediately</option>
                    <option value="DRAFT">Save Draft</option>
                    <option value="SCHEDULED">Schedule Publish</option>
                    <option value="ARCHIVED">Archive</option>
                  </select>
                </div>
              </div>

              {target === 'BATCH' && (
                <div className="border rounded-xl p-4 bg-muted/20 border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> Select Batches</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {batches.map(b => (
                      <label key={b.id} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBatchIds.includes(b.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedBatchIds([...selectedBatchIds, b.id]);
                            else setSelectedBatchIds(selectedBatchIds.filter(id => id !== b.id));
                          }}
                          className="rounded text-primary w-4 h-4"
                        />
                        {b.batchName}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {target === 'SUBJECT' && (
                <div className="border rounded-xl p-4 bg-muted/20 border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Book className="w-4 h-4 text-primary" /> Select Subjects</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {subjects.map(s => (
                      <label key={s.id} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSubjectIds.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedSubjectIds([...selectedSubjectIds, s.id]);
                            else setSelectedSubjectIds(selectedSubjectIds.filter(id => id !== s.id));
                          }}
                          className="rounded text-primary w-4 h-4"
                        />
                        {s.subjectName} ({s.subjectCode})
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="border rounded-xl p-4 bg-muted/20 border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><User className="w-4 h-4 text-primary" /> Target Specific Users Directly (Optional)</p>
                <div className="max-h-28 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-2">
                  {users.map(u => (
                    <label key={u.id} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(u.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedUserIds([...selectedUserIds, u.id]);
                          else setSelectedUserIds(selectedUserIds.filter(id => id !== u.id));
                        }}
                        className="rounded text-primary w-4 h-4"
                      />
                      <div>
                        <span>{u.fullName}</span>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground ml-1.5">({u.role})</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Publish Date</label>
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full h-10 px-3.5 border rounded-xl border-border bg-card text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Expiry Date</label>
                  <input
                    type="datetime-local"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full h-10 px-3.5 border rounded-xl border-border bg-card text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Attachment */}
              <div className="border rounded-xl p-4 bg-muted/20 border-border">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Upload Notice Attachment (Optional)</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    id="admin-attachment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="admin-attachment"
                    className="cursor-pointer bg-card border border-border hover:bg-muted/40 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    {uploading ? "Uploading..." : "Select File"}
                  </label>
                  {attachmentUrl && (
                    <span className="text-xs text-emerald-600 font-semibold truncate max-w-[200px]">
                      {attachmentUrl.split('/').pop()}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <Button type="button" variant="outline" onClick={resetForm} className="h-10 px-4 rounded-xl text-xs font-semibold cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl cursor-pointer">
                  {editingAnnouncement ? "Save Changes" : "Create Broadcast"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Details View Modal */}
      {isDetailsOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground">Announcement Details</h2>
              <button onClick={() => setIsDetailsOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase mb-2 ${
                  selectedAnnouncement.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' :
                  selectedAnnouncement.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
                  'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                }`}>
                  {selectedAnnouncement.priority} Priority
                </span>
                <h1 className="text-xl font-bold text-foreground leading-snug">{selectedAnnouncement.title}</h1>
              </div>

              <div className="flex items-center justify-between p-3.5 border border-border rounded-xl bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {selectedAnnouncement.sender?.fullName.charAt(0) || "A"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{selectedAnnouncement.sender?.fullName || "Admin"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-mono">{selectedAnnouncement.sender?.role || "SYSTEM"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Publish Date</p>
                  <p className="text-xs text-foreground font-semibold mt-0.5">
                    {new Date(selectedAnnouncement.publishDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Message Body</p>
                <div className="bg-muted/20 border border-border p-4 rounded-xl text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <div className="p-4 border border-border rounded-xl bg-muted/20 space-y-2">
                  <p className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> Recipient Tracking</p>
                  <div>
                    <span className="font-semibold text-muted-foreground">Target Type:</span>
                    <span className="font-bold text-foreground ml-1.5 bg-primary/10 text-primary px-2 py-0.5 rounded-full">{selectedAnnouncement.target}</span>
                  </div>
                  {selectedAnnouncement.batches && selectedAnnouncement.batches.length > 0 && (
                    <div>
                      <span className="font-semibold text-muted-foreground">Batches:</span>
                      <span className="font-semibold text-foreground ml-1.5">{selectedAnnouncement.batches.map(b => b.batchName).join(", ")}</span>
                    </div>
                  )}
                  {selectedAnnouncement.subjects && selectedAnnouncement.subjects.length > 0 && (
                    <div>
                      <span className="font-semibold text-muted-foreground">Subjects:</span>
                      <span className="font-semibold text-foreground ml-1.5">{selectedAnnouncement.subjects.map(s => s.subjectName).join(", ")}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-muted-foreground">Total Recipients:</span>
                    <span className="font-bold text-primary ml-1.5">{selectedAnnouncement.recipientCount ?? 0} Users</span>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-xl bg-muted/20 space-y-2">
                  <p className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Lifecycle Dates</p>
                  <div>
                    <span className="font-semibold text-muted-foreground">Created At:</span>
                    <span className="font-semibold text-foreground ml-1.5">{new Date(selectedAnnouncement.publishDate).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Expiry Date:</span>
                    <span className="font-semibold text-foreground ml-1.5">
                      {selectedAnnouncement.expiryDate ? new Date(selectedAnnouncement.expiryDate).toLocaleString() : "Never Expires"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAnnouncement.attachmentUrl && (
                <div className="p-4 border border-border rounded-xl bg-muted/20 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-500" />
                    <div>
                      <p className="font-bold text-foreground">Attached Notice Document</p>
                    </div>
                  </div>
                  <a
                    href={selectedAnnouncement.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-white hover:bg-primary/95 text-[11px] font-bold px-3 py-2 rounded-xl"
                  >
                    View File
                  </a>
                </div>
              )}

              <div className="pt-3 border-t border-border flex justify-end">
                <Button onClick={() => setIsDetailsOpen(false)} variant="outline" className="h-9 px-4 rounded-xl text-xs font-semibold cursor-pointer">
                  Close Details
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Delete Announcement</h3>
            <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete this announcement? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => { setIsDeleteConfirmOpen(false); setAnnouncementToDelete(null); }} className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 py-2 text-xs font-bold cursor-pointer">
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
