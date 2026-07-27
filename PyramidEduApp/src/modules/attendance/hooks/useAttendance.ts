import { useState, useEffect } from "react";
import { WeeklyAttendanceDay, SubjectAttendance } from "../types/attendance.types";
import { DEFAULT_WEEKLY_ATTENDANCE, DEFAULT_SUBJECT_ATTENDANCE } from "../constants/attendance.constants";
import { useAttendanceStore } from "../store/attendance.store";
import { fetchMyAttendance } from "../services/attendance.service";

export const useAttendance = (accessToken: string | null, studentData: any) => {
  const [weeklyData, setWeeklyData] = useState<WeeklyAttendanceDay[]>(DEFAULT_WEEKLY_ATTENDANCE);
  const [subjectData, setSubjectData] = useState<SubjectAttendance[]>(DEFAULT_SUBJECT_ATTENDANCE);
  const [loading, setLoading] = useState(false);
  const { overallPercentage, setOverallPercentage } = useAttendanceStore();

  useEffect(() => {
    if (studentData?.student?.attendancePercentage !== undefined) {
      setOverallPercentage(Number(studentData.student.attendancePercentage));
    }
  }, [studentData]);

  const loadAttendanceDetails = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await fetchMyAttendance();
      // We can map backend data to subject-wise attendance if structure matches,
      // or fall back on defaults if not present
    } catch (err) {
      console.error("Failed to fetch detailed attendance details, using fallbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadAttendanceDetails();
    }
  }, [accessToken]);

  return {
    weeklyData,
    subjectData,
    overallPercentage,
    loading,
    refresh: loadAttendanceDetails,
  };
};
