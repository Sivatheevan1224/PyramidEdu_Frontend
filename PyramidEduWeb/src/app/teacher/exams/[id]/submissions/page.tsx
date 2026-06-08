"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/exams/${params.id}/results`);
        setSubmissions(data.data || []);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [params.id]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/teacher/exams/${params.id}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Student Submissions</h1>
          <p className="text-sm text-slate-500">Review results and grade manual answers.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center animate-pulse">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No submissions yet for this exam.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Date Submitted</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Score</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {submissions.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{sub.student?.user?.name || 'Unknown Student'}</div>
                    <div className="text-xs text-slate-500">{sub.student?.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {sub.status === 'GRADED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3 h-3" /> Graded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 rounded-full text-xs font-bold">
                        <Clock className="w-3 h-3" /> Needs Review
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                    {sub.totalScore}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs cursor-pointer"
                      onClick={() => router.push(`/teacher/exams/${params.id}/submissions/${sub.id || sub.submissionId || 'sub-' + idx}/grade`)}
                    >
                      {sub.status === 'GRADED' ? 'View Result' : 'Grade Now'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
