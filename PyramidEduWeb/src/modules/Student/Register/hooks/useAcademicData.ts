"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchStreams, fetchSubjects } from "../services";
import type { StreamOption, CourseOption } from "../types";

export function useAcademicData() {
  const [streams, setStreams] = useState<StreamOption[]>([]);
  const [streamsLoading, setStreamsLoading] = useState(false);
  const [subjects, setSubjects] = useState<CourseOption[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  // Fetch streams on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setStreamsLoading(true);
      try {
        const data = await fetchStreams();
        if (!mounted) return;
        setStreams(data);
      } catch (error) {
        console.error("Streams fetch error:", error);
        toast.error("Unable to load streams from server.");
      } finally {
        setStreamsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Fetch all available subjects on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setSubjectsLoading(true);
      try {
        const data = await fetchSubjects();
        if (!mounted) return;
        setSubjects(data);
      } catch (error) {
        console.error("Subjects fetch error:", error);
        toast.error("Unable to load subjects from server.");
        setSubjects([]);
      } finally {
        setSubjectsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return { streams, streamsLoading, subjects, subjectsLoading };
}
