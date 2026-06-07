import { useState, useEffect, useCallback } from "react";
import { fetchRegisteredStudents, updateApprovalStatus, updatePaymentStatus } from "../services/api";
import { RegisteredStudent } from "../types";
import { toast } from "sonner";

export const useRegisteredStudents = () => {
  const [data, setData] = useState<RegisteredStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const students = await fetchRegisteredStudents();
      setData(students);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch registered students.");
      toast.error("Failed to fetch registered students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdatePayment = async (id: string, status: string) => {
    try {
      await updatePaymentStatus(id, status);
      toast.success("Payment status updated.");
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update payment status.");
    }
  };

  const handleUpdateApproval = async (id: string, status: string) => {
    try {
      await updateApprovalStatus(id, status);
      toast.success("Approval status updated.");
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update approval status.");
    }
  };

  return { data, loading, error, reload: loadData, handleUpdatePayment, handleUpdateApproval };
};
