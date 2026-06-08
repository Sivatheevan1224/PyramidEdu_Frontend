"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchBatches, fetchStreams, fetchSubjects, fetchTeachersForSubject } from "@/modules/Student/Register/services/registerApi";
import type { BatchOption, StreamOption, CourseOption, TeacherOption } from "@/modules/Student/Register/types";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Loader2, UserRound, GraduationCap, Sparkles } from "lucide-react";

export function TeachersSection() {
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [streams, setStreams] = useState<StreamOption[]>([]);
  const [subjects, setSubjects] = useState<CourseOption[]>([]);

  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<(TeacherOption & { assignedSubject?: string })[]>([]);

  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load: batches, streams, subjects
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoadingBatches(true);
        const [batchesData, streamsData, subjectsData] = await Promise.all([
          fetchBatches(),
          fetchStreams(),
          fetchSubjects(),
        ]);
        setBatches(batchesData);
        setStreams(streamsData);
        setSubjects(subjectsData);

        if (batchesData.length > 0) {
          setActiveBatchId(batchesData[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
        setError("Failed to load batches.");
      } finally {
        setIsLoadingBatches(false);
      }
    }
    loadInitialData();
  }, []);

  // When activeBatchId changes, compute subjects and fetch teachers
  useEffect(() => {
    async function loadTeachers() {
      if (!activeBatchId) return;

      setIsLoadingTeachers(true);
      setError(null);

      try {
        // 1. Find streams that belong to the active batch
        const batchStreams = streams.filter(s =>
          !s.batchIds || s.batchIds.length === 0 || s.batchIds.includes(activeBatchId)
        );
        const batchStreamIds = batchStreams.map(s => s.id);
        const batchStreamNames = batchStreams.map(s => s.name.trim().toLowerCase());

        // 2. Find subjects that belong to those streams
        const batchSubjects = subjects.filter(sub => {
          const hasStreamId = sub.streamIds?.some(id => batchStreamIds.includes(id));
          const hasStreamName = sub.streamNames?.some(name =>
            batchStreamNames.includes(name.trim().toLowerCase())
          );
          return hasStreamId || hasStreamName;
        });

        // 3. Fetch teachers for all matched subjects in parallel
        const teachersPromises = batchSubjects.map(async sub => {
          const fetchedTeachers = await fetchTeachersForSubject(sub.id);
          return fetchedTeachers.map(t => ({ ...t, assignedSubject: sub.name }));
        });
        const teachersResults = await Promise.all(teachersPromises);

        // 4. Flatten and deduplicate teachers by id
        const allTeachers: (TeacherOption & { assignedSubject?: string })[] = [];
        const seenIds = new Set<string>();

        teachersResults.flat().forEach(teacher => {
          if (!seenIds.has(teacher.id)) {
            seenIds.add(teacher.id);
            allTeachers.push(teacher);
          } else {
            // If the teacher teaches multiple subjects, we could join them
            const existing = allTeachers.find(t => t.id === teacher.id);
            if (existing && teacher.assignedSubject && !existing.assignedSubject?.includes(teacher.assignedSubject)) {
              existing.assignedSubject += `, ${teacher.assignedSubject}`;
            }
          }
        });

        setTeachers(allTeachers);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
        setError("Failed to load teachers for this batch.");
      } finally {
        setIsLoadingTeachers(false);
      }
    }

    loadTeachers();
  }, [activeBatchId, streams, subjects]);

  return (
    <div className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 dark:bg-violet-900/30 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Our Institute</span>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
          Learn from the Best
        </h3>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Our experienced teachers are dedicated to guiding you through your academic journey.
        </p>
      </div>

      {isLoadingBatches ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : batches.length === 0 ? (
        <div className="text-center text-slate-500 py-8">No batches found.</div>
      ) : (
        <>
          {/* Batch Selector (Tabs/Pills) */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 px-4">
            {batches.map(batch => (
              <button
                key={batch.id}
                onClick={() => setActiveBatchId(batch.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeBatchId === batch.id
                    ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
              >
                {batch.name}
              </button>
            ))}
          </div>

          {/* Teachers Grid */}
          <div className="relative min-h-[300px]">
            {isLoadingTeachers ? (
              <div className="absolute inset-0 flex justify-center items-start pt-12 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-lg border border-slate-100 dark:border-slate-700">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm font-medium">Loading teachers...</span>
                </div>
              </div>
            ) : null}

            {!isLoadingTeachers && teachers.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <GraduationCap className="h-12 w-12 mx-auto text-slate-400 mb-4 opacity-50" />
                <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No teachers assigned</h4>
                <p className="text-sm text-slate-500 mt-1">There are currently no teachers assigned to subjects in this batch.</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isLoadingTeachers ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                {teachers.map(teacher => (
                  <Card
                    key={teacher.id}
                    className="group relative overflow-hidden bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800/60 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 text-center flex flex-col items-center"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500" />

                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40 flex items-center justify-center mb-4 ring-4 ring-white dark:ring-slate-950 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <UserRound className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {teacher.name}
                    </h4>

                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto pt-2">
                      {teacher.qualification || teacher.assignedSubject}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
