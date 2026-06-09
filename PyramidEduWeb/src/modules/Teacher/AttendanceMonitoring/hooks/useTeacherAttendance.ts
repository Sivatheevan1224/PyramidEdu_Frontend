import { useState, useEffect, useCallback } from "react";
import { fetchTeacherSummaryData } from "../services/api";
import { StudentSummary } from "../types";

export const useTeacherAttendance = () => {
  const [data, setData] = useState<StudentSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async (p: number, s: string) => {
    setLoading(true);
    try {
      const res = await fetchTeacherSummaryData(p, s);
      setData(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary(page, search);
  }, [page, fetchSummary]);

  const handleSearch = () => {
    setPage(1);
    fetchSummary(1, search);
  };

  return {
    data,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    loading,
    handleSearch
  };
};
