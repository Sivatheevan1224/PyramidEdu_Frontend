"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Search,
  BookOpen,
  Layers,
  GraduationCap,
  Calendar,
  Percent,
  CheckCircle,
  AlertTriangle,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface UnifiedMark {
  id: string;
  student: {
    id: string;
    fullName: string;
    indexNumber: string;
    batch: string;
    stream: string;
  };
  subject: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    fullName: string;
  };
  title: string;
  type: "MANUAL_EXAM" | "ONLINE_EXAM" | "QUIZ" | "ASSIGNMENT";
  marksObtained: number | null;
  totalMarks: number;
  isAbsent: boolean;
  examDate: string;
}

export default function TeacherMarksPage() {
  const [marks, setMarks] = useState<UnifiedMark[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");


  useEffect(() => {
    async function fetchMetadata() {
      try {
        const [batchesRes, streamsRes] = await Promise.all([
          api.get("/batches"),
          api.get("/subjects/streams"),
        ]);
        setBatches(batchesRes.data?.data || batchesRes.data || []);
        setStreams(streamsRes.data?.data || streamsRes.data || []);
      } catch (err) {
        console.error("Failed to load metadata filters:", err);
      }
    }
    fetchMetadata();
  }, []);

  useEffect(() => {
    async function fetchMarks() {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedBatch) params.batchId = selectedBatch;
        if (selectedStream) params.streamId = selectedStream;
        if (selectedType) params.type = selectedType;
        if (searchQuery) params.search = searchQuery;


        const res = await api.get("/marks", { params });
        setMarks(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch marks:", err);
        toast.error("Could not retrieve marks list.");
      } finally {
        setLoading(false);
      }
    }
    fetchMarks();
  }, [selectedBatch, selectedStream, selectedType, searchQuery]);


  // Statistics calculation
  const stats = useMemo(() => {
    const validMarks = marks.filter((m) => m.marksObtained !== null && !m.isAbsent);
    const count = validMarks.length;
    if (count === 0) {
      return { avg: 0, top: 0, passRate: 0, totalCount: marks.length };
    }

    let sum = 0;
    let top = 0;
    let passes = 0;

    validMarks.forEach((m) => {
      const percentage = (m.marksObtained! / m.totalMarks) * 100;
      sum += percentage;
      if (percentage > top) top = percentage;
      if (percentage >= 50) passes++;
    });

    return {
      avg: Math.round(sum / count),
      top: Math.round(top),
      passRate: Math.round((passes / count) * 100),
      totalCount: marks.length,
    };
  }, [marks]);

  // Chart data
  const chartData = useMemo(() => {
    const assessmentMap: Record<string, { title: string; totalPct: number; count: number }> = {};

    marks.forEach((m) => {
      if (m.marksObtained === null || m.isAbsent) return;
      const pct = (m.marksObtained / m.totalMarks) * 100;
      if (assessmentMap[m.title]) {
        assessmentMap[m.title].totalPct += pct;
        assessmentMap[m.title].count += 1;
      } else {
        assessmentMap[m.title] = { title: m.title, totalPct: pct, count: 1 };
      }
    });

    return Object.values(assessmentMap)
      .map((entry) => ({
        name: entry.title.length > 20 ? entry.title.substring(0, 17) + "..." : entry.title,
        average: Math.round(entry.totalPct / entry.count),
      }))
      .slice(0, 8);
  }, [marks]);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "MANUAL_EXAM":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40";
      case "ONLINE_EXAM":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/40";
      case "QUIZ":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40";
      case "ASSIGNMENT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800";
    }
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 75) return "text-emerald-600 dark:text-emerald-400 font-bold";
    if (pct >= 50) return "text-slate-900 dark:text-slate-100 font-semibold";
    return "text-rose-600 dark:text-rose-400 font-bold";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Student Marks Ledger
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor and evaluate the performance of your students across manual and online exams.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Records</p>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{stats.totalCount}</h3>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <BookOpen className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Class Average</p>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{stats.avg}%</h3>
          </div>
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl">
            <Percent className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Top Percentage</p>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{stats.top}%</h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Award className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Passing Rate</p>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{stats.passRate}%</h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Chart & Filters Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Filters Panel */}
        <Card className="p-6 space-y-4 shadow-sm border border-slate-100 dark:border-slate-800 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Filter Data</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                  {b.batchName}
                </option>
              ))}
            </select>

          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stream</label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-colors"

            >
              <option value="" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">All Streams</option>
              {streams.map((s) => (
                <option key={s.id} value={s.id} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                  {s.streamName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessment Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium">All Types</option>
              <option value="MANUAL_EXAM" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium">Manual Exam</option>
              <option value="ONLINE_EXAM" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium">Online Exam</option>
              <option value="QUIZ" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium">Quiz</option>
              <option value="ASSIGNMENT" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium">Assignment</option>
            </select>

          </div>


          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </Card>

        {/* Analytics Chart */}
        <Card className="p-6 shadow-sm border border-slate-100 dark:border-slate-800 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Assessment Averages (%)</h3>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No performance data available for selected filters.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} fontSize={11} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      borderColor: "#e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="average" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.average >= 75 ? "#10b981" : entry.average >= 50 ? "#0ea5e9" : "#f43f5e"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Marks Table */}
      <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Marks ledger</h3>
          <span className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full px-3 py-1">
            {marks.length} Records found
          </span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              Loading student marks ledger...
            </div>
          ) : marks.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              No student marks matching selected criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 dark:bg-slate-900/40 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Assessment</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Subject</th>
                  <th className="px-6 py-3.5">Score</th>
                  <th className="px-6 py-3.5">Grade / Pct</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-350">
                {marks.map((m) => {
                  const percentage =
                    m.marksObtained !== null ? Math.round((m.marksObtained / m.totalMarks) * 100) : 0;
                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {m.student.fullName}
                        </div>
                        <div className="text-xs text-slate-400">
                          Index: {m.student.indexNumber || "N/A"} | {m.student.batch}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                        {m.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBadgeColor(m.type)}`}>
                          {m.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">{m.subject.name}</td>
                      <td className="px-6 py-4">
                        {m.isAbsent ? (
                          <span className="text-rose-500 font-bold">Absent</span>
                        ) : m.marksObtained !== null ? (
                          <span>
                            {m.marksObtained} <span className="text-slate-400">/ {m.totalMarks}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {m.isAbsent ? (
                          <span className="text-rose-500 font-bold">-</span>
                        ) : m.marksObtained !== null ? (
                          <span className={getScoreColor(percentage)}>{percentage}%</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(m.examDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
