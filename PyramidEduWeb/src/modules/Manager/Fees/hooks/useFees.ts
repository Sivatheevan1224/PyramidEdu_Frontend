import { useState, useEffect, useCallback } from "react";
import { fetchFeeManagementData, fetchStudentPaymentHistory } from "../services/api";
import { updateMonthlyFeeStatus } from "../../StudentManagement/services/api";
import { toast } from "sonner";

export const useFees = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [status, setStatus] = useState("ALL");
  const [method, setMethod] = useState("ALL");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const fees = await fetchFeeManagementData({
        search: search || undefined,
        indexNumber: indexNumber || undefined,
        status: status || undefined,
        method: method || undefined,
      });
      setData(fees);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch fee data.");
      toast.error("Failed to fetch fee data.");
    } finally {
      setLoading(false);
    }
  }, [search, indexNumber, status, method]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleMonthlyFeeStatus = async (id: string, currentStatus: 'PAID' | 'UNPAID') => {
    try {
      const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
      await updateMonthlyFeeStatus(id, newStatus);
      toast.success("Payment status updated.");
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update payment status.");
    }
  };

  return {
    data,
    loading,
    error,
    reload: loadData,
    handleToggleMonthlyFeeStatus,
    filters: {
      search,
      setSearch,
      indexNumber,
      setIndexNumber,
      status,
      setStatus,
      method,
      setMethod,
    },
  };
};
