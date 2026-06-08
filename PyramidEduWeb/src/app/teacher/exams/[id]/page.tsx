"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Users, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExamDetails } from '@/modules/Teacher/hooks/useExams';

export default function ExamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { exam, isLoading, fetchDetails } = useExamDetails(params.id as string);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) {
    return <div className="p-12 text-center animate-pulse">Loading exam details...</div>;
  }

  if (!exam) {
    return <div className="p-12 text-center text-rose-500">Exam not found.</div>;
  }

  const now = new Date();
  const start = exam.startTime ? new Date(exam.startTime) : null;
  const canEdit = !start || now < start;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/teacher/exams')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{exam.examTitle}</h1>
            <p className="text-sm text-slate-500">Subject: {exam.subject?.subjectName}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="text-slate-600"
            onClick={() => router.push(`/teacher/exams/${exam.id}/submissions`)}
          >
            <Users className="w-4 h-4 mr-2" />
            View Results
          </Button>
          {canEdit && (
            <Button
              variant="outline"
              className="text-indigo-600"
              onClick={() => router.push(`/teacher/exams/${exam.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Exam
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Exam Settings</h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{exam.examType}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Marks</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{exam.totalMarks}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {exam.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <hr className="border-slate-100 dark:border-slate-800 my-2" />
              <div className="flex gap-2">
                <Calendar className="w-4 h-4" />
                <span>{exam.startTime ? new Date(exam.startTime).toLocaleString() : 'No Schedule'}</span>
              </div>
              <div className="flex gap-2">
                <Clock className="w-4 h-4" />
                <span>{exam.duration ? `${exam.duration} Minutes` : 'No Time Limit'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Questions ({exam.questions?.length || 0})</h3>
            </div>
            
            <div className="space-y-4">
              {exam.questions?.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 text-slate-500">
                  No questions added yet.
                </div>
              ) : (
                exam.questions?.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {idx + 1}. {q.questionText}
                      </p>
                      <div className="flex gap-2">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded dark:bg-indigo-500/10 dark:text-indigo-400">
                          {q.marks} marks
                        </span>
                        {canEdit && (
                          <button className="text-slate-400 hover:text-rose-500 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {q.questionType === 'MCQ' && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {q.options?.map((opt: any, oIdx: number) => {
                          const isCorrect = q.correctAnswer === opt.id;
                          return (
                            <div key={opt.id} className={`text-sm p-2 rounded border ${isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 font-medium' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                              {String.fromCharCode(65 + oIdx)}. {opt.text}
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
