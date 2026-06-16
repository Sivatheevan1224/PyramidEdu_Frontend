"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Bell,
  Trash2,
  Edit,
  Eye,
  Plus,
  Send,
  Calendar,
  FileText,
  Upload,
  User,
  Users,
  Book,
  X,
  Search,
  Filter
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
  recipientCount?: number;
  senderId: string;
}

export default function TeacherAnnouncementsPage() {
  const { user } = useAuth();
  
  // Lists
  const [activeTab, setActiveTab] = useState<'received' | 'my'>('received');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [allocatedSubjects, setAllocatedSubjects] = useState<any[]>([]);
  const [subjectBatchesMap, setSubjectBatchesMap] = useState<Record<string, any[]>>({});

  // Filtering & Pagination
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Statistics
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });

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
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED">("PUBLISHED");
  const [publishDate, setPublishDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch lists
  useEffect(() => {
    fetchAnnouncements();
    fetchTeacherAllocations();
  }, [search, filterPriority, filterStatus, page, activeTab]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'my' ? '/announcements/my' : '/announcements/received';
      const { data } = await api.get(endpoint, {
        params: {
          page,
          limit: 10,
          title: search || undefined,
          priority: filterPriority || undefined,
          status: activeTab === 'my' ? (filterStatus || undefined) : undefined,
        }
      });
      if (data?.data) {
        setAnnouncements(data.data.data || []);
        setTotalPages(data.data.totalPages || 1);
        
        // Calculate basic stats for this dashboard using '/my'
        const allRes = await api.get(`/announcements/my?limit=100`);
        const allList: Announcement[] = allRes.data?.data?.data || [];
        setStats({
          total: allList.length,
          published: allList.filter(a => a.status === 'PUBLISHED').length,
          drafts: allList.filter(a => a.status === 'DRAFT').length
        });
      }
    } catch (error) {
      console.error("Failed to load teacher announcements", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherAllocations = async () => {
    try {
      // Fetch own profile to see active allocations
      const { data } = await api.get("/teachers/me");
      const teacherProfile = data?.data;
      if (teacherProfile) {
        const allocs = teacherProfile.subjectAllocations || [];
        
        // Form active subjects list
        const activeSubjects: any[] = [];
        const batchesMap: Record<string, any[]> = {};

        // Primary subject
        if (teacherProfile.primarySubject) {
          activeSubjects.push(teacherProfile.primarySubject);
          batchesMap[teacherProfile.primarySubject.id] = [];
        }

        allocs.forEach((alloc: any) => {
          if (alloc.status === 'ACTIVE' && alloc.subject) {
            // Avoid duplicates
            if (!activeSubjects.some(s => s.id === alloc.subject.id)) {
              activeSubjects.push(alloc.subject);
            }
            batchesMap[alloc.subject.id] = alloc.batches || [];
          }
        });

        setAllocatedSubjects(activeSubjects);
        setSubjectBatchesMap(batchesMap);
      }
    } catch (error) {
      console.error("Failed to load teacher allocations", error);
    }
  };

  // Handle file upload
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

  // Submit Compose/Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and message content are required");
      return;
    }

    if (!selectedSubjectId) {
      toast.error("You must select an assigned subject for the announcement");
      return;
    }

    const payload = {
      title,
      content,
      target: "STUDENT", // Teachers target students only
      priority,
      status,
      publishDate: publishDate ? new Date(publishDate).toISOString() : undefined,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
      batchIds: selectedBatchIds,
      subjectIds: [selectedSubjectId],
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
    setPriority(ann.priority);
    setStatus(ann.status);
    setPublishDate(ann.publishDate ? new Date(ann.publishDate).toISOString().slice(0, 16) : "");
    setExpiryDate(ann.expiryDate ? new Date(ann.expiryDate).toISOString().slice(0, 16) : "");
    setSelectedSubjectId(ann.subjects?.[0]?.id || "");
    setSelectedBatchIds(ann.batches?.map(b => b.id) || []);
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

  const resetForm = () => {
    setIsComposeOpen(false);
    setEditingAnnouncement(null);
    setTitle("");
    setContent("");
    setPriority("MEDIUM");
    setStatus("PUBLISHED");
    setPublishDate("");
    setExpiryDate("");
    setSelectedSubjectId("");
    setSelectedBatchIds([]);
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

  // Get current batches for selected subject
  const currentBatches = selectedSubjectId ? (subjectBatchesMap[selectedSubjectId] || []) : [];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary animate-pulse" /> {activeTab === 'my' ? "My Announcements" : "Received Announcements"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {activeTab === 'my' 
              ? "Manage notices you created for your allocated subjects and batches."
              : "View notices sent to you by Admin or Manager."}
          </p>
        </div>
        {activeTab === 'my' && (
          <Button onClick={() => setIsComposeOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white rounded-xl py-2 px-4 font-bold shadow-md shadow-primary/20">
            <Plus className="w-5 h-5" /> Compose Announcement
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b dark:border-slate-800 gap-6">
        <button
          onClick={() => { setActiveTab('received'); setPage(1); }}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'received'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Received Announcements
        </button>
        <button
          onClick={() => { setActiveTab('my'); setPage(1); }}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'my'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          My Announcements
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="My Total Notices" value={stats.total.toString()} />
        <StatCard label="Published" value={stats.published.toString()} />
        <StatCard label="Drafts" value={stats.drafts.toString()} />
      </div>

      {/* Filters */}
      <Card className="p-4 border dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-xl dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border dark:border-slate-800 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {activeTab === 'my' && (
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border dark:border-slate-800 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        )}
      </Card>

      {/* List */}
      <Card className="overflow-hidden border dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-500 uppercase tracking-wider border-b dark:border-slate-800">
              {activeTab === 'my' ? (
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Allocated Subject</th>
                  <th className="px-6 py-4">Target Batches</th>
                  <th className="px-6 py-4">Recipients</th>
                  <th className="px-6 py-4">Publish Date</th>
                  <th className="px-6 py-4 text-center">Priority</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Sender Role</th>
                  <th className="px-6 py-4">Target Subject/Batch</th>
                  <th className="px-6 py-4">Publish Date</th>
                  <th className="px-6 py-4 text-center">Priority</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={activeTab === 'my' ? 8 : 7} className="px-6 py-8 text-center text-slate-400">
                    Loading announcements...
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'my' ? 8 : 7} className="px-6 py-8 text-center text-slate-400">
                    No announcements found.
                  </td>
                </tr>
              ) : (
                announcements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    {activeTab === 'my' ? (
                      <>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                          {ann.title}
                        </td>
                        <td className="px-6 py-4">
                          {ann.subjects?.map(s => s.subjectName).join(", ") || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          {ann.batches && ann.batches.length > 0 ? ann.batches.map(b => b.batchName).join(", ") : "All Students"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                          {ann.recipientCount ?? 0} Students
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(ann.publishDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                            ann.priority === 'HIGH' ? 'bg-red-50 text-red-700' :
                            ann.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {ann.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                            ann.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' :
                            ann.status === 'DRAFT' ? 'bg-slate-100 text-slate-600' :
                            ann.status === 'SCHEDULED' ? 'bg-indigo-50 text-indigo-700' :
                            'bg-violet-50 text-violet-700'
                          }`}>
                            {ann.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2.5">
                          <Button size="sm" variant="ghost" onClick={() => viewDetails(ann.id)} className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 text-slate-600 dark:text-slate-400">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(ann)} className="h-8 w-8 p-0 rounded-lg text-blue-600 hover:bg-blue-50">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(ann.id)} className="h-8 w-8 p-0 rounded-lg text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                          {ann.title}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                          {ann.sender?.fullName || "Staff"}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          {ann.sender?.role || "ADMIN"}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {ann.subjects?.map(s => s.subjectName).join(", ") || ann.batches?.map(b => b.batchName).join(", ") || "General"}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(ann.publishDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                            ann.priority === 'HIGH' ? 'bg-red-50 text-red-700' :
                            ann.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {ann.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2.5">
                          <Button size="sm" variant="ghost" onClick={() => viewDetails(ann.id)} className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 text-slate-600 dark:text-slate-400">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="outline" className="h-9 px-3 rounded-lg text-xs">
              Previous
            </Button>
            <span className="text-xs text-slate-500 font-semibold">Page {page} of {totalPages}</span>
            <Button disabled={page === totalPages} onClick={() => setPage(page + 1)} variant="outline" className="h-9 px-3 rounded-lg text-xs">
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Compose overlay Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" /> {editingAnnouncement ? "Edit Announcement" : "Compose Student Notice"}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-4 text-left">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Announcement Title</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full px-3.5 py-2.5 border rounded-xl dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border rounded-xl dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Message / Notice Content</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type notice message..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 border rounded-xl dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Assigned Subject</label>
                  <select
                    required
                    value={selectedSubjectId}
                    onChange={(e) => {
                      setSelectedSubjectId(e.target.value);
                      setSelectedBatchIds([]);
                    }}
                    className="w-full px-3.5 py-2.5 border rounded-xl dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
                  >
                    <option value="">-- Choose Subject --</option>
                    {allocatedSubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.subjectName} ({sub.subjectCode})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Publish Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border rounded-xl dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
                  >
                    <option value="PUBLISHED">Publish immediately</option>
                    <option value="DRAFT">Save Draft</option>
                    <option value="SCHEDULED">Schedule Publish</option>
                    <option value="ARCHIVED">Archive</option>
                  </select>
                </div>
              </div>

              {selectedSubjectId && currentBatches.length > 0 && (
                <div className="border rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> Target Assigned Batches</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentBatches.map(b => (
                      <label key={b.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Publish Date</label>
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Expiry Date</label>
                  <input
                    type="datetime-local"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Attachment */}
              <div className="border rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Upload Notice Attachment (Optional)</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    id="teacher-attachment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="teacher-attachment"
                    className="cursor-pointer bg-white dark:bg-slate-800 border dark:border-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold shadow-xs"
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

              <div className="pt-4 flex justify-end gap-3 border-t dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={resetForm} className="h-10 px-4 rounded-xl text-xs font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl">
                  {editingAnnouncement ? "Save Changes" : "Create Notice"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Details View Modal */}
      {isDetailsOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Announcement Details</h2>
              <button onClick={() => setIsDetailsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase mb-2 ${
                  selectedAnnouncement.priority === 'HIGH' ? 'bg-red-50 text-red-700' :
                  selectedAnnouncement.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {selectedAnnouncement.priority} Priority
                </span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">{selectedAnnouncement.title}</h1>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Body</p>
                <div className="bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 p-4 rounded-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <div className="p-4 border dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-2">
                  <p className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> Targets</p>
                  <div>
                    <span className="font-semibold text-slate-500">Subject:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 ml-1.5">{selectedAnnouncement.subjects?.map(s => s.subjectName).join(", ") || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Targeted Batches:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1.5">
                      {selectedAnnouncement.batches && selectedAnnouncement.batches.length > 0 ? selectedAnnouncement.batches.map(b => b.batchName).join(", ") : "All Students"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Total Recipients:</span>
                    <span className="font-bold text-primary ml-1.5">{selectedAnnouncement.recipientCount ?? 0} Students</span>
                  </div>
                </div>

                <div className="p-4 border dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-2">
                  <p className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Timestamps</p>
                  <div>
                    <span className="font-semibold text-slate-500">Publish Date:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1.5">{new Date(selectedAnnouncement.publishDate).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selectedAnnouncement.attachmentUrl && (
                <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300">Attached Notice Document</p>
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

              <div className="pt-3 border-t dark:border-slate-800 flex justify-end">
                <Button onClick={() => setIsDetailsOpen(false)} className="h-9 px-4 rounded-xl text-xs font-bold">
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
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Delete Announcement</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to delete this announcement? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => { setIsDeleteConfirmOpen(false); setAnnouncementToDelete(null); }} className="rounded-xl px-4 py-2 text-xs font-semibold">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-red-200 dark:shadow-none">
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
