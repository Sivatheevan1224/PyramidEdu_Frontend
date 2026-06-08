import { useState, useEffect, useCallback } from "react";
import { fetchManagerStudentDetailsData } from "../services/api";
import { AttendanceRecord, StudentInfo } from "../types";

export const useManagerStudentDetails = (studentId: string) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      // Skipping subjectId filter since it wasn't implemented on the page
      const data = await fetchManagerStudentDetailsData(studentId, fromDate, toDate, "");
      setStudentInfo(data.studentInfo);
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
      setLoading(true);
      fetchManagerStudentDetailsData(studentId, "", "", "")
        .then(data => {
          setStudentInfo(data.studentInfo);
          setAttendances(data.attendances);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 0);
  };

  return {
    studentInfo,
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
