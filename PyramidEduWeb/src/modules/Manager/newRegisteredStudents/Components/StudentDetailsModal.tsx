import { useEffect, useState } from "react";
import { fetchStudentDetails } from "../services/api";
import { StudentDetails } from "../types";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  studentId: string;
  onClose: () => void;
}

export default function StudentDetailsModal({ studentId, onClose }: Props) {
  const [data, setData] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const details = await fetchStudentDetails(studentId);
        setData(details);
      } catch (err: any) {
        setError("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">Student Registration Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error || !data ? (
            <p className="text-red-500 text-center py-10">{error}</p>
          ) : (
            <>
              {/* Student Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-primary uppercase text-xs tracking-wider">Student Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <div><span className="text-muted-foreground block">Full Name</span> <span className="font-medium">{data.user.fullName}</span></div>
                  <div><span className="text-muted-foreground block">Email</span> <span className="font-medium">{data.user.email}</span></div>
                  <div><span className="text-muted-foreground block">NIC</span> <span className="font-medium">{data.nic || "N/A"}</span></div>
                  <div><span className="text-muted-foreground block">Phone Number</span> <span className="font-medium">{data.phone || "N/A"}</span></div>
                  <div><span className="text-muted-foreground block">Gender</span> <span className="font-medium">{data.gender || "N/A"}</span></div>
                  <div><span className="text-muted-foreground block">Date of Birth</span> <span className="font-medium">{data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : "N/A"}</span></div>
                  <div className="col-span-2"><span className="text-muted-foreground block">Address</span> <span className="font-medium">{data.address || "N/A"}</span></div>
                </div>
              </div>

              {/* Parent Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-primary uppercase text-xs tracking-wider">Parent/Guardian Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <div><span className="text-muted-foreground block">Name</span> <span className="font-medium">{data.parent?.parentName || "N/A"}</span></div>
                  <div><span className="text-muted-foreground block">Relationship</span> <span className="font-medium">{data.parent?.relation || "N/A"}</span></div>
                  <div><span className="text-muted-foreground block">Phone</span> <span className="font-medium">{data.parent?.phone || "N/A"}</span></div>
                  <div><span className="text-muted-foreground block">Email</span> <span className="font-medium">{data.parent?.email || "N/A"}</span></div>
                </div>
              </div>

              {/* Academic Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-primary uppercase text-xs tracking-wider">Academic Information</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/10">
                    <div>
                      <span className="text-muted-foreground block">Selected Stream</span>
                      <span className="font-semibold text-base">{data.stream?.streamName || "N/A"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground block">A/L Batch</span>
                      <span className="font-semibold text-base">{data.batch || "N/A"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-2">Selected Subjects</span>
                    <ul className="space-y-2">
                      {data.enrollments.map((enr, i) => (
                        <li key={i} className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                          <div>
                            <p className="font-semibold">{enr.subject.subjectName}</p>
                            <p className="text-xs text-muted-foreground">Teacher: {enr.teacher?.user.fullName || "Unassigned"}</p>
                          </div>
                          <span className="font-semibold text-primary">Rs. {Number(enr.subject.feeAmount).toLocaleString()}.00</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-white/10">
                    <span className="font-bold">Total Fee Amount</span>
                    <span className="font-black text-primary text-lg">Rs. {Number(data.totalFeeAmount).toLocaleString()}.00</span>
                  </div>
                </div>
              </div>

              {/* Registration Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-primary uppercase text-xs tracking-wider">Registration Status</h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <div><span className="text-muted-foreground block">Registration Date</span> <span className="font-medium">{new Date(data.createdAt).toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground block">Account Status</span> <span className="font-medium">{data.user.isActive ? "Active" : "Inactive"}</span></div>
                  <div>
                    <span className="text-muted-foreground block">Payment Status</span>
                    <span className={`inline-block px-2 py-1 mt-1 rounded-md text-xs font-bold ${data.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : data.paymentStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {data.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Approval Status</span>
                    <span className={`inline-block px-2 py-1 mt-1 rounded-md text-xs font-bold ${data.approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : data.approvalStatus === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {data.approvalStatus}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
