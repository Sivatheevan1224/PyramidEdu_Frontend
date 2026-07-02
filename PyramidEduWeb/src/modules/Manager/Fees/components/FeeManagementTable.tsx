import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface FeeManagementTableProps {
  loading: boolean;
  paginatedStudents: any[];
  totalStudents: number;
  startIndex: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleMonthlyFee: (id: string, currentStatus: 'PAID' | 'UNPAID') => void;
  onViewHistory: (id: string) => void;
}

export default function FeeManagementTable({
  loading,
  paginatedStudents,
  totalStudents,
  startIndex,
  itemsPerPage,
  currentPage,
  totalPages,
  onPageChange,
  onToggleMonthlyFee,
  onViewHistory
}: FeeManagementTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs uppercase text-muted-foreground font-extrabold">
            <th className="pb-3 px-4">Student Name</th>
            <th className="pb-3 px-4">Index Number</th>
            <th className="pb-3 px-4 text-right">Total Fees</th>
            <th className="pb-3 px-4 text-center">Payment Status</th>
            <th className="pb-3 px-4 text-center">Payment Method</th>
            <th className="pb-3 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {paginatedStudents.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-muted-foreground">
                No students match your filter criteria.
              </td>
            </tr>
          ) : (
            paginatedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                
                {/* Student Name */}
                <td className="py-4 px-4">
                  <span className="font-bold text-foreground block">{student.studentName}</span>
                </td>

                {/* Index Number */}
                <td className="py-4 px-4 font-mono text-muted-foreground">
                  {student.indexNumber || "Pending"}
                </td>

                {/* Total Fees */}
                <td className="py-4 px-4 text-right font-extrabold text-foreground">
                  Rs. {student.totalFees.toLocaleString()}.00
                </td>

                {/* Payment Status Toggle */}
                <td className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={student.monthlyFeeStatus === 'PAID'} 
                        onChange={() => onToggleMonthlyFee(student.id, student.monthlyFeeStatus)} 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      student.monthlyFeeStatus === 'PAID' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
                    }`}>
                      {student.monthlyFeeStatus}
                    </span>
                  </div>
                </td>

                {/* Payment Method */}
                <td className="py-4 px-4 text-center">
                  <Badge variant="outline" className={`font-bold capitalize ${
                    student.paymentMethod === "CARD" 
                      ? "border-primary/20 text-primary bg-primary/5" 
                      : student.paymentMethod === "CASH"
                        ? "border-amber-200 text-amber-600 dark:text-amber-400 bg-amber-500/5" 
                        : "border-slate-200 text-slate-500 bg-slate-50"
                  }`}>
                    {student.paymentMethod === "CARD" ? "Online" : student.paymentMethod === "CASH" ? "Cash Counter" : "N/A"}
                  </Badge>
                </td>

                {/* View Action */}
                <td className="py-4 px-4 text-center">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewHistory(student.id)}
                    className="h-8 text-xs cursor-pointer"
                  >
                    View
                  </Button>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, totalStudents)}</span> of <span className="font-medium">{totalStudents}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Previous Page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium px-2">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Next Page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
