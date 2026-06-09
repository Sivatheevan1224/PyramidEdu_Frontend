import { useState, useEffect } from "react";
import { fetchSubjectsData, fetchBatchesData, fetchSubjectTeachersData, createClassSessionData } from "../services/api";
import { Subject, Batch } from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreateSession = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  
  const [subjectId, setSubjectId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessionTime, setSessionTime] = useState("");

  const [subjectQuery, setSubjectQuery] = useState("");
  const [batchQuery, setBatchQuery] = useState("");
  const [teacherQuery, setTeacherQuery] = useState("");
  
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);

  const [teachersLoading, setTeachersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const initFetch = async () => {
      try {
        const [subData, batchData] = await Promise.all([
          fetchSubjectsData(),
          fetchBatchesData()
        ]);
        setSubjects(subData);
        setBatches(batchData);
      } catch (err) {
        console.error("Initialization failed", err);
      }
    };
    initFetch();
  }, []);

  useEffect(() => {
    if (!subjectId) {
      setTeachers([]);
      setTeacherId("");
      return;
    }

    const fetchTeachers = async () => {
      setTeachersLoading(true);
      try {
        const rows = await fetchSubjectTeachersData(subjectId);
        const mapped = rows
          .filter((item: any) => item?.isActive !== false && item?.user?.isActive !== false)
          .map((item: any) => ({
            id: String(item.id),
            name: String(item.user?.fullName ?? item.name ?? `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim()) || "Assigned Teacher",
          }));
        setTeachers(mapped);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
        setTeachers([]);
      } finally {
        setTeachersLoading(false);
      }
    };

    fetchTeachers();
    setTeacherId("");
  }, [subjectId]);

  const handleCreateClass = async () => {
    if (!subjectId || !teacherId || !sessionDate || !sessionTime) {
      toast.error("Subject, Teacher, Session Date, and Session Time are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createClassSessionData({
        subjectId,
        teacherId,
        batchId: batchId || undefined,
        sessionDate,
        sessionTime,
      });
      if (res.success) {
        toast.success("Class session created successfully.");
        router.push("/manager/attendance");
      }
    } catch (err: any) {
      console.error("Failed to create class", err);
      toast.error(err.response?.data?.message || "Failed to create class.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    subjects,
    batches,
    teachers,
    subjectId, setSubjectId,
    batchId, setBatchId,
    teacherId, setTeacherId,
    sessionDate, setSessionDate,
    sessionTime, setSessionTime,
    subjectQuery, setSubjectQuery,
    batchQuery, setBatchQuery,
    teacherQuery, setTeacherQuery,
    subjectDropdownOpen, setSubjectDropdownOpen,
    batchDropdownOpen, setBatchDropdownOpen,
    teacherDropdownOpen, setTeacherDropdownOpen,
    teachersLoading,
    submitting,
    handleCreateClass
  };
};
