import { useState, useEffect, useCallback } from "react";
import { fetchSessionsData, fetchSessionStudentsData, submitManualAttendance } from "../services/api";
import { ClassSession, StudentRecord } from "../types";
import { toast } from "sonner";

export const useSessionList = () => {
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [sessionQuery, setSessionQuery] = useState("");
  const [sessionDropdownOpen, setSessionDropdownOpen] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  
  const [selectedStudents, setSelectedStudents] = useState<Record<string, boolean | undefined>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionDate) return;
    
    const fetchSessions = async () => {
      setSessionsLoading(true);
      try {
        const data = await fetchSessionsData(sessionDate);
        setSessions(data);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };
    
    fetchSessions();
    setSessionId(""); 
    setStudents([]);
  }, [sessionDate]);

  const handleLoadStudents = useCallback(async () => {
    if (!sessionId) {
      toast.error("Please select a class session first.");
      return;
    }

    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    setStudentsLoading(true);
    try {
      const loadedStudents = await fetchSessionStudentsData(session);
      setStudents(loadedStudents);
      
      const initialSelection: Record<string, boolean | undefined> = {};
      loadedStudents.forEach((s: StudentRecord) => {
        initialSelection[s.studentId] = s.hasRecord ? s.isPresent : undefined;
      });
      setSelectedStudents(initialSelection);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load students.");
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  }, [sessionId, sessions]);

  const handleCheckboxChange = (studentId: string, checked: boolean) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleMarkAll = (checked: boolean) => {
    const updated: Record<string, boolean> = {};
    students.forEach((student) => {
      updated[student.studentId] = checked;
    });
    setSelectedStudents(updated);
  };

  const handleSubmit = async () => {
    if (students.length === 0) return;

    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const records = students.map((student) => ({
      studentId: student.studentId,
      subjectId: session.subjectId,
      teacherId: session.teacherId,
      classSessionId: session.id,
      sessionDate: session.sessionDate,
      sessionTime: session.sessionTime,
      attendanceStatus: selectedStudents[student.studentId] === true ? "PRESENT" : "ABSENT",
      attendanceMethod: "MANUAL",
      isPresent: selectedStudents[student.studentId] === true,
    }));

    setSubmitting(true);
    try {
      await submitManualAttendance(records);
      toast.success("Attendance updated successfully.");
      handleLoadStudents(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    sessionDate,
    setSessionDate,
    sessions,
    sessionId,
    setSessionId,
    sessionQuery,
    setSessionQuery,
    sessionDropdownOpen,
    setSessionDropdownOpen,
    sessionsLoading,
    students,
    studentsLoading,
    selectedStudents,
    submitting,
    handleLoadStudents,
    handleCheckboxChange,
    handleMarkAll,
    handleSubmit
  };
};
