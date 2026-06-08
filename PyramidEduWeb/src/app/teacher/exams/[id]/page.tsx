"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Users, Trash2, Calendar, Clock, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExamDetails } from '@/modules/Teacher/hooks/useExams';
import { deleteExamQuestion } from '@/modules/Teacher/services/exam.api';
import { toast } from 'sonner';

export default function ExamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { exam, isLoading, fetchDetails, setExam } = useExamDetails(params.id as string);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) {
    return <div className="p-12 text-center animate-pulse">Loading exam details...</div>;
  }

  if (!exam) {
    return <div className="p-12 text-center text-rose-500 font-semibold">Exam not found.</div>;
  }

  const now = new Date();
  const start = exam.startTime ? new Date(exam.startTime) : null;
  
  // If exam is NOT published (meaning it is a draft), the teacher can ALWAYS edit it!
  const canEdit = !exam.isPublished || !start || now < start;

  const getStatusLabel = () => {
    const durationMins = exam.duration || 60;
    const end = start ? new Date(start.getTime() + durationMins * 60000) : null;

    if (!exam.isPublished) return "Draft";
    if (start && now < start) return "Upcoming";
    if (start && end && now >= start && now <= end) return "Active";
    return "Completed";
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('Are you sure you want to remove this question?')) return;
    const toastId = toast.loading('Removing question...');
    try {
      await deleteExamQuestion(exam.id, qId);
      if (exam.questions) {
        setExam({
          ...exam,
          questions: exam.questions.filter((q: any) => q.id !== qId)
        });
      }
      toast.success('Question removed successfully', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove question', { id: toastId });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/teacher/exams')}
            className="rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/50"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{exam.examTitle}</h1>
            <p className="text-sm text-slate-500 mt-1">Subject: {exam.subject?.subjectName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer"
            onClick={() => router.push(`/teacher/exams/${exam.id}/submissions`)}
          >
            <Users className="w-4.5 h-4.5 mr-2 text-indigo-500" />
            View Submissions
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
            <div className="space-y-4.5 text-sm text-slate-600 dark:text-slate-400">
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
                <span className="text-slate-400 font-medium">Status</span>
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
              </div>
              
              <hr className="border-slate-100 dark:border-slate-800/80" />
              
              <div className="space-y-3 font-medium">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4.5 h-4.5 text-slate-400" />
                  <span>{start ? start.toLocaleString() : 'No Schedule'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4.5 h-4.5 text-slate-400" />
                  <span>{exam.duration ? `${exam.duration} Minutes` : 'No Time Limit'}</span>
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
                      <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        {idx + 1}. {q.questionText}
                      </p>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md dark:bg-indigo-500/10 dark:text-indigo-400 uppercase tracking-wide">
                          {q.marks} marks
                        </span>
                        {canEdit && (
                          <button 
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer"
                            title="Remove Question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {q.questionType === 'MCQ' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options?.map((opt: any, oIdx: number) => {
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
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
