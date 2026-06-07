import { RegisteredStudent } from "../types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Props {
  students: RegisteredStudent[];
  onViewDetails: (id: string) => void;
  onUpdatePayment: (id: string, status: string) => void;
  onUpdateApproval: (id: string, status: string) => void;
}

export default function RegisteredStudentsTable({ students, onViewDetails, onUpdatePayment, onUpdateApproval }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-slate-900">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/10">
          <tr>
            <th className="px-6 py-4 font-semibold">Student Name</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold">Stream</th>
            <th className="px-6 py-4 font-semibold text-right">Total Fee</th>
            <th className="px-6 py-4 font-semibold text-center">Payment Status</th>
            <th className="px-6 py-4 font-semibold text-center">Approval Status</th>
            <th className="px-6 py-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-medium text-foreground">{student.studentName}</td>
              <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
              <td className="px-6 py-4 text-muted-foreground">{student.stream}</td>
              <td className="px-6 py-4 text-right font-semibold text-primary">Rs. {student.totalFeeAmount.toLocaleString()}.00</td>
              <td className="px-6 py-4 text-center">
                <select
                  value={student.paymentStatus}
                  onChange={(e) => onUpdatePayment(student.id, e.target.value)}
                  className={`text-xs font-bold rounded-lg px-2 py-1.5 border outline-none cursor-pointer
                    ${student.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30' :
                      student.paymentStatus === 'PARTIAL' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30' :
                      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30'}`}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PAID">PAID</option>
                </select>
              </td>
              <td className="px-6 py-4 text-center">
                <select
                  value={student.approvalStatus}
                  onChange={(e) => onUpdateApproval(student.id, e.target.value)}
                  className={`text-xs font-bold rounded-lg px-2 py-1.5 border outline-none cursor-pointer
                    ${student.approvalStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30' :
                      student.approvalStatus === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30' :
                      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30'}`}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </td>
              <td className="px-6 py-4 text-center">
                <Button variant="ghost" size="sm" onClick={() => onViewDetails(student.id)} className="h-8 gap-2">
                  <Eye className="h-4 w-4" /> View
                </Button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                No registered students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
