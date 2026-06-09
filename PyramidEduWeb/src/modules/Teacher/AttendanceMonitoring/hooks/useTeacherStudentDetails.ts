import { useState, useEffect, useCallback } from "react";
import { fetchTeacherStudentDetailsData } from "../services/api";
import { AttendanceRecord } from "../types";

export const useTeacherStudentDetails = (studentId: string) => {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTeacherStudentDetailsData(studentId, fromDate, toDate);
      setAttendances(data.attendances);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [studentId, fromDate, toDate]);

  useEffect(() => {
    fetchDetails();
  }, [studentId]); // Only fetch initially when studentId changes

  const handleApplyFilters = () => {
    fetchDetails();
  };
  
  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setTimeout(() => {
      // Create a temporary fetch here because state updates are async
      setLoading(true);
      fetchTeacherStudentDetailsData(studentId, "", "")
        .then(data => setAttendances(data.attendances))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 0);
  };

  return {
    attendances,
    loading,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    handleApplyFilters,
    clearFilters
  };
};
