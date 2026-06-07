import { useState, useEffect, useCallback } from "react";
import { fetchApprovedStudents, toggleStudentStatus } from "../services/api";
import { ApprovedStudent } from "../types";
import { toast } from "sonner";

export const useStudentManagement = () => {
  const [data, setData] = useState<ApprovedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const students = await fetchApprovedStudents();
      setData(students);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch students.");
      toast.error("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { data, loading, error, reload: loadData, handleToggleStatus };
};
