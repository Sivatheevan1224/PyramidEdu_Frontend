"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Users, Trash2, Calendar, Clock, Award, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExamDetails } from '../hooks/useExams';
import { deleteExamQuestion } from '../services/exam.api';
import { toast } from 'sonner';

/* ─────────────────────────── Delete Question Modal ─────────────────────────── */
interface DeleteQuestionModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteQuestionConfirmModal({ onConfirm, onCancel, isDeleting }: DeleteQuestionModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(15,23,42,0.55)" }}
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-6 pb-4 px-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            Remove Question?
          </h2>
          <p className="text-xs text-slate-505 text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to remove this question? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            className="flex-1 h-9 rounded-lg text-xs font-semibold"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-9 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useAuth } from '@/context/AuthContext';
import * as api from '../services/exam.api';

export function ExamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { exam, isLoading, fetchDetails, setExam } = useExamDetails(params.id as string);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) {
    return <div className="p-12 text-center animate-pulse">Loading exam details...</div>;
  }

  if (!exam) {
    return <div className="p-12 text-center text-rose-500 font-semibold">Exam not found.</div>;
  }

  const start = exam.startTime ? new Date(exam.startTime) : null;
  
  const canEdit = !exam.isPublished || !start || now < start;
  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const getStatusLabel = () => {
    const durationMins = exam.duration || 60;
    const computedStart = start ? start : (exam.examDate ? new Date(exam.examDate) : null);
    const end = computedStart ? new Date(computedStart.getTime() + durationMins * 60000) : null;

    if (!exam.isPublished) return "Draft";
    if (computedStart && now < computedStart) return "Upcoming";
    if (computedStart && end && now >= computedStart && now <= end) return "Active";
    return "Completed";
  };

  const getCountdownText = () => {
    if (!exam.isPublished || !start) return null;
    const durationMins = exam.duration || 60;
    const end = new Date(start.getTime() + durationMins * 60000);
    const status = getStatusLabel();

    if (status === "Upcoming") {
      const diffMs = start.getTime() - now.getTime();
      const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
      const hours = Math.floor(diffSecs / 3600);
      const mins = Math.floor((diffSecs % 3600) / 60);
      const secs = diffSecs % 60;
      return `Starts in: ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (status === "Active") {
      const diffMs = end.getTime() - now.getTime();
      const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
      const mins = Math.floor(diffSecs / 60);
      const secs = diffSecs % 60;
      return `Time Left: ${mins}:${secs.toString().padStart(2, '0')}`;
    }

    return null;
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    setIsDeletingQuestion(true);
    const toastId = toast.loading('Removing question...');
    try {
      await deleteExamQuestion(exam.id, questionToDelete);
      if (exam.questions) {
        setExam({
          ...exam,
          questions: exam.questions.filter((q: any) => q.id !== questionToDelete)
        });
      }
      toast.success('Question removed successfully', { id: toastId });
      setQuestionToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove question', { id: toastId });
    } finally {
      setIsDeletingQuestion(false);
    }
  };

  const handleTogglePublish = async () => {
    const toastId = toast.loading(exam.isPublished ? 'Unpublishing exam...' : 'Publishing exam...');
    try {
      const updated = await api.updateExam(exam.id, { isPublished: !exam.isPublished });
      setExam(updated);
      toast.success(updated.isPublished ? 'Exam published!' : 'Exam unpublished!', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update publishing status', { id: toastId });
    }
  };



  return (
    <>
      {questionToDelete && (
        <DeleteQuestionConfirmModal
          onConfirm={confirmDeleteQuestion}
          onCancel={() => !isDeletingQuestion && setQuestionToDelete(null)}
          isDeleting={isDeletingQuestion}
        />
      )}

      <div className="space-y-8 max-w-5xl mx-auto p-4">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/teacher/exams')}
              className="rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/50 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-505" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{exam.examTitle}</h1>
              <p className="text-sm text-slate-500 mt-1">Subject: {exam.subject?.subjectName}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              variant="outline" 
              className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer font-semibold"
              onClick={() => router.push(`/teacher/exams/${exam.id}/submissions`)}
            >
              <Users className="w-4.5 h-4.5 mr-2 text-indigo-500" />
              View Submissions
            </Button>
            
            {/* Publish Toggle Button (Available for Teachers and Admins) */}
            <Button
              variant="outline"
              onClick={handleTogglePublish}
              className={`rounded-xl font-bold cursor-pointer transition-colors ${
                exam.isPublished
                  ? 'text-amber-600 border-amber-200 bg-amber-50/15 hover:bg-amber-50'
                  : 'text-emerald-600 border-emerald-250 bg-emerald-50/15 hover:bg-emerald-50'
              }`}
            >
              {exam.isPublished ? 'Unpublish / Draft' : 'Publish Exam'}
            </Button>



            {canEdit && (
              <Button
                variant="outline"
                className="text-indigo-600 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/10 dark:bg-indigo-500/5 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl font-bold cursor-pointer"
                onClick={() => router.push(`/teacher/exams/${exam.id}/edit`)}
              >
                <Edit className="w-4.5 h-4.5 mr-2" />
                Edit Exam
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Settings Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Exam Settings</h3>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Type</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 bg-indigo-50/50 dark:bg-indigo-950/20 px-2.5 py-1 rounded-md text-xs tracking-wider uppercase border border-indigo-100 dark:border-indigo-900/30">
                    {exam.examType}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Total Marks</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Award className="w-4 h-4 text-indigo-500" />
                    {exam.totalMarks} Marks
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Submissions</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Users className="w-4 h-4 text-indigo-500" />
                    {exam._count?.submissions || 0} Submitted
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Timeline Status</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-semibold px-2.5 py-1 rounded-md text-xs border-none ${
                      getStatusLabel() === "Active"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : getStatusLabel() === "Upcoming"
                        ? "bg-blue-500/15 text-blue-600"
                        : getStatusLabel() === "Draft"
                        ? "bg-amber-500/15 text-amber-600"
                        : "bg-slate-500/15 text-slate-600 dark:text-slate-400"
                    }`}>
                      {getStatusLabel()}
                    </span>
                    {getCountdownText() && (
                      <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 px-1.5 py-0.5 rounded-md animate-pulse">
                        {getCountdownText()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Publishing</span>
                  <span className={`font-semibold px-2.5 py-1 rounded-md text-xs border-none ${
                    exam.isPublished
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-amber-500/15 text-amber-600"
                  }`}>
                    {exam.isPublished ? "Published" : "Draft / Private"}
                  </span>
                </div>

                
                <hr className="border-slate-100 dark:border-slate-800/80" />
                
                <div className="space-y-3 font-medium">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4.5 h-4.5 text-slate-400" />
                    <span className="text-slate-400 text-xs uppercase tracking-wider block font-semibold">Exam Date</span>
                    <span className="ml-auto">{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4.5 h-4.5 text-slate-400" />
                    <span className="text-slate-400 text-xs uppercase tracking-wider block font-semibold">Start Time</span>
                    <span className="ml-auto">{start ? start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No Start Time'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4.5 h-4.5 text-slate-400" />
                    <span className="text-slate-400 text-xs uppercase tracking-wider block font-semibold">Duration</span>
                    <span className="ml-auto">{exam.duration ? `${exam.duration} Mins` : 'Untimed'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4.5 h-4.5 text-slate-400" />
                    <span className="text-slate-400 text-xs uppercase tracking-wider block font-semibold">Batch</span>
                    <span className="ml-auto">{exam.batchRecord?.batchName || 'All Batches'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Catalog */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xl">
                Questions ({exam.questions?.length || 0})
              </h3>
              
              <div className="space-y-5">
                {exam.questions?.length === 0 ? (
                  <div className="text-center py-10 border border-dashed rounded-xl border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                    No questions added yet.
                  </div>
                ) : (
                  exam.questions?.map((q, idx) => (
                    <div key={q.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/10 space-y-4 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-1">
                          <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                            {idx + 1}. {q.questionType === 'IMAGE' ? <span className="text-xs text-indigo-500 uppercase tracking-wider block font-bold mb-1">[Image-Based Question]</span> : null}
                            {q.questionText}
                          </p>
                          {q.questionType === 'IMAGE' && q.imageUrl && (
                            <img src={q.imageUrl} alt={`Question ${idx + 1}`} className="max-h-48 object-contain rounded-lg border border-slate-200" />
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md dark:bg-indigo-500/10 dark:text-indigo-400 uppercase tracking-wide">
                            {q.marks} marks
                          </span>
                          {canEdit && (
                            <button 
                              onClick={() => setQuestionToDelete(q.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer"
                              title="Remove Question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {Array.isArray(q.options) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt: any, oIdx: number) => {
                            const isCorrect = q.correctAnswer === opt.id;
                            return (
                              <div 
                                key={opt.id} 
                                className={`text-sm p-3 rounded-xl border flex items-center gap-2.5 ${
                                  isCorrect 
                                    ? 'bg-emerald-50/80 border-emerald-500 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold' 
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                                <span className="font-bold text-slate-400 shrink-0">{String.fromCharCode(65 + oIdx)}.</span>
                                <span className="truncate">{opt.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {q.explanation && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/50 rounded-xl text-xs">
                          <p className="text-amber-800 dark:text-amber-300"><span className="font-bold">Explanation:</span> {q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ExamDetailsPage;
