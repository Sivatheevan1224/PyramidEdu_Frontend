import { useState, useEffect, useCallback } from "react";
import { fetchApprovedStudents, toggleStudentStatus, updateMonthlyFeeStatus } from "../services/api";
import { ApprovedStudent } from "../types";
import { toast } from "sonner";

export const useStudentManagement = () => {
  const [data, setData] = useState<ApprovedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [batchId, setBatchId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [status, setStatus] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const students = await fetchApprovedStudents({
        search: search || undefined,
        indexNumber: indexNumber || undefined,
        batchId: batchId || undefined,
        subjectId: subjectId || undefined,
        status: status || undefined,
      });
      setData(students);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch students.");
      toast.error("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  }, [search, indexNumber, batchId, subjectId, status]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStudentStatus(id);
      toast.success("Student status updated.");
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleToggleMonthlyFeeStatus = async (id: string, currentStatus: 'PAID' | 'UNPAID') => {
    try {
      const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
      await updateMonthlyFeeStatus(id, newStatus);
      toast.success("Monthly fee status updated.");
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update monthly fee status.");
    }
  };

  return {
    data,
    loading,
    error,
    reload: loadData,
    handleToggleStatus,
    handleToggleMonthlyFeeStatus,
    filters: {
      search,
      setSearch,
      indexNumber,
      setIndexNumber,
      batchId,
      setBatchId,
      subjectId,
      setSubjectId,
      status,
      setStatus,
    },
  };
};
