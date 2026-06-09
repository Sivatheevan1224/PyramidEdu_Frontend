"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  FileText,
  Calendar,
  Users,
  Search,
  Plus,
  Filter,
  Trash2,
  Edit,
  Eye,
  Clock,
  Loader2,
  BookOpen,
  Award,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react";
import { useExams } from "@/modules/Teacher/hooks/useExams";
import { toast } from "sonner";

/* ─────────────────────────── Delete Confirm Modal ─────────────────────────── */
interface DeleteModalProps {
  examTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmModal({ examTitle, onConfirm, onCancel, isDeleting }: DeleteModalProps) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(15,23,42,0.55)" }}
      onClick={onCancel}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close btn */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon header */}
        <div className="pt-8 pb-5 px-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
            Delete Exam?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            You are about to permanently delete{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              &quot;{examTitle}&quot;
            </span>
            . This action cannot be undone.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 dark:bg-slate-800 mx-8" />

        {/* Actions */}
        <div className="flex items-center gap-3 px-8 py-5">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold cursor-pointer shadow-md shadow-rose-500/20 transition-colors"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {isDeleting ? "Deleting…" : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Page ─────────────────────────── */
export default function TeacherExamsPage() {
  const router = useRouter();
  const { exams, isLoading, fetchExams, deleteExam } = useExams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  // Modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const openDeleteModal = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setDeleteTarget({ id, title });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting exam…");
    try {
      await deleteExam(deleteTarget.id);
      toast.success("Exam deleted successfully", { id: toastId });
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete exam", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatus = (exam: any) => {
    const now = new Date();
    const start = exam.startTime ? new Date(exam.startTime) : null;
    const durationMins = exam.duration || 60;
    const end = start ? new Date(start.getTime() + durationMins * 60000) : null;

    if (!exam.isPublished) return "Draft";
    if (start && now < start) return "Upcoming";
    if (start && end && now >= start && now <= end) return "Active";
    return "Completed";
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.subject?.subjectName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const status = getStatus(exam);
    const matchesStatus = statusFilter === "All" || status.toUpperCase() === statusFilter.toUpperCase();
    const matchesType = typeFilter === "All" || exam.examType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <>
      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <DeleteConfirmModal
          examTitle={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isDeleting && setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}

      <div className="space-y-8 p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Exams</h1>
            <p className="text-sm text-slate-500 mt-1">Create, monitor, and grade subject exams</p>
          </div>
          <Button
            onClick={() => router.push("/teacher/exams/create")}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-5 py-6 rounded-xl font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center transition-all"
          >
            <Plus className="mr-2 h-5 w-5" /> Create Exam
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by title, subject..."
              className="pl-10 h-11 border-slate-200 dark:border-slate-800 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-11 border-slate-200 dark:border-slate-800 rounded-xl">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] h-11 border-slate-200 dark:border-slate-800 rounded-xl">
                <SelectValue placeholder="Exam Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="QUIZ">Quiz</SelectItem>
                <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                <SelectItem value="MIDTERM">Midterm</SelectItem>
                <SelectItem value="FINAL">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Exam Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          </div>
        ) : filteredExams.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-slate-200 dark:border-slate-800 rounded-2xl">
            <FileText className="w-14 h-14 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No exams found</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              There are no exams matching your search or filters. Click &quot;Create Exam&quot; to schedule a new one.
            </p>
          </Card>
        ) : (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            {filteredExams.map((exam) => {
              const status = getStatus(exam);
              const start = exam.startTime ? new Date(exam.startTime) : null;
              const now = new Date();
              const canEdit = !exam.isPublished || !start || now < start;
              const durationMins = exam.duration || 60;

              return (
                <Card
                  key={exam.id}
                  className="flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer overflow-hidden rounded-2xl min-h-[300px] group border-t-4 border-t-indigo-600/80"
                  onClick={() => router.push(`/teacher/exams/${exam.id}`)}
                >
                  {/* Card Body */}
                  <div className="p-7 space-y-5 flex-1">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-md text-[11px] uppercase tracking-wider">
                        {exam.examType}
                      </Badge>
                      <Badge
                        className={`font-semibold px-2.5 py-1 rounded-md text-xs border-none ${
                          status === "Active"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : status === "Upcoming"
                            ? "bg-blue-500/15 text-blue-600"
                            : status === "Draft"
                            ? "bg-amber-500/15 text-amber-600"
                            : "bg-slate-500/15 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {status}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                        {exam.examTitle}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-2 mt-1.5 font-medium">
                        <BookOpen className="w-4 h-4 text-indigo-500/70" />
                        {exam.subject?.subjectName || "Subject"}
                      </p>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800/80 my-3" />

                    <div className="grid grid-cols-2 gap-4.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      <div className="space-y-1">
                        <span className="text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Start Time</span>
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{start ? start.toLocaleDateString() : "TBD"}</span>
                        </div>
                        {start && (
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 pl-5.5">
                            {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Duration</span>
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{exam.duration ? `${exam.duration} Mins` : "Untimed"}</span>
                        </div>
                      </div>

                      <div className="space-y-1 mt-1">
                        <span className="text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Marks</span>
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                          <Award className="w-4 h-4 text-indigo-500" />
                          <span>{exam.totalMarks} Marks</span>
                        </div>
                      </div>

                      <div className="space-y-1 mt-1">
                        <span className="text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Submissions</span>
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                          <Users className="w-4 h-4 text-indigo-500" />
                          <span>{exam._count?.submissions || 0} Submitted</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 px-7 py-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/teacher/exams/${exam.id}`);
                        }}
                        title="View details"
                      >
                        <Eye className="h-5 w-5 text-slate-500 hover:text-slate-700" />
                      </Button>

                      {/* Edit & Delete — only for Draft / Upcoming */}
                      {canEdit && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 cursor-pointer text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/teacher/exams/${exam.id}/edit`);
                            }}
                            title="Edit exam"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 cursor-pointer text-slate-500 hover:text-rose-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            onClick={(e) => openDeleteModal(e, exam.id, exam.examTitle)}
                            title="Delete exam"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 text-xs cursor-pointer text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 bg-white dark:bg-slate-900 rounded-xl font-bold transition-all px-4.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/teacher/exams/${exam.id}/submissions`);
                      }}
                    >
                      View Submissions
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
