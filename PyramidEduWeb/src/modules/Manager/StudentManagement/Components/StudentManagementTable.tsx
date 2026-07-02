import { ApprovedStudent } from "../types";
import { Button } from "@/components/ui/button";
import { Eye, Edit, QrCode } from "lucide-react";

interface Props {
  students: ApprovedStudent[];
  onViewDetails: (id: string) => void;
  onEditStudent: (id: string) => void;
  onViewQR: (student: any) => void; // Uses detailed student data ideally, or basic
  onToggleStatus: (id: string) => void;
  onToggleMonthlyFee?: (id: string, currentStatus: 'PAID' | 'UNPAID') => void;
  onReEnroll: (id: string) => void;
}

export default function StudentManagementTable({ students, onViewDetails, onEditStudent, onViewQR, onToggleStatus, onToggleMonthlyFee, onReEnroll }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-slate-900">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/10">
          <tr>
            <th className="px-6 py-4 font-semibold">Student Name</th>
            <th className="px-6 py-4 font-semibold">Index Number</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold text-center">Monthly Fee</th>
            <th className="px-6 py-4 font-semibold text-center">Active Status</th>
            <th className="px-6 py-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-medium text-foreground">{student.studentName}</td>
              <td className="px-6 py-4 text-muted-foreground font-mono">{student.indexNumber || "Pending"}</td>
              <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex flex-col items-center justify-center gap-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={student.monthlyFeeStatus === 'PAID'} 
                      onChange={() => onToggleMonthlyFee?.(student.id, student.monthlyFeeStatus as 'PAID' | 'UNPAID')} 
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  </label>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    student.monthlyFeeStatus === 'PAID' ? 'text-emerald-600 dark:text-emerald-400' :
                    student.monthlyFeeStatus === 'PARTIAL' ? 'text-amber-600 dark:text-amber-400' :
                    student.monthlyFeeStatus === 'OVERDUE' ? 'text-rose-600 dark:text-rose-400' :
                    'text-slate-500'
                  }`}>
                    {student.monthlyFeeStatus}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={student.isActive} 
                    onChange={() => onToggleStatus(student.id)} 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                </label>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onViewDetails(student.id)} className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEditStudent(student.id)} className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10" title="Edit Basic Details">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onReEnroll(student.id)} className="h-8 px-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                    Re-Enroll
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onViewQR(student)} className="h-8 w-8 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" title="View QR">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                No approved students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
