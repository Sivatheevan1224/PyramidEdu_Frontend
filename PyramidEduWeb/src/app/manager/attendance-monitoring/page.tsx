"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface StudentSummary {
  studentId: string;
  studentName: string;
  indexNumber: string;
  mostRecentStatus: string;
  last7Days: string[];
}

export default function ManagerAttendanceSummary() {
  const [data, setData] = useState<StudentSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSummary = async (p = 1, s = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance/manager/summary?page=${p}&limit=10&search=${s}`);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(page, search);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchSummary(1, search);
  };

  const renderStatusCircle = (status: string, i: number) => {
    if (status === "PRESENT") {
      return <div key={i} className="w-3 h-3 rounded-full bg-green-500 inline-block mr-1" title="Present" />;
    }
    if (status === "ABSENT") {
      return <div key={i} className="w-3 h-3 rounded-full bg-red-500 inline-block mr-1" title="Absent" />;
    }
    return <div key={i} className="w-3 h-3 rounded-full bg-gray-300 inline-block mr-1" title={status} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Student Attendance Monitoring</h2>
      </div>

      <Card className="p-5">
        <div className="flex items-center space-x-2 mb-4 max-w-sm">
          <Input 
            placeholder="Search by name or index..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-xs uppercase text-muted-foreground bg-muted/50">
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Index Number</th>
                  <th className="px-4 py-3">Attendance Status</th>
                  <th className="px-4 py-3">Last 7 Days</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">No records found.</td>
                  </tr>
                ) : (
                  data.map((student) => (
                    <tr key={student.studentId} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{student.studentName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.indexNumber}</td>
                      <td className="px-4 py-3">
                        {renderStatusCircle(student.mostRecentStatus, -1)}
                        <span className="ml-1 text-xs capitalize">{student.mostRecentStatus.toLowerCase()}</span>
                      </td>
                      <td className="px-4 py-3">
                        {student.last7Days.map((status, i) => renderStatusCircle(status, i))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => router.push(`/manager/attendance-monitoring/${student.studentId}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
