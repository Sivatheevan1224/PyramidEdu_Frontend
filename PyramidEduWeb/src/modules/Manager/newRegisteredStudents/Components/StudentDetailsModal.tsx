import { useEffect, useState } from "react";
import { fetchStudentDetails } from "../services/api";
import { StudentDetails } from "../types";
import { Loader2, X, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenerateQRModal from "@/components/GenerateQRModal";

interface Props {
  studentId: string;
  onClose: () => void;
}

export default function StudentDetailsModal({ studentId, onClose }: Props) {
  const [data, setData] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

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
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Student Registration Details</h2>
            {!loading && data && data.approvalStatus === 'APPROVED' && (
              <Button size="sm" variant="outline" onClick={() => setShowQRModal(true)} className="gap-2">
                <QrCode className="h-4 w-4" /> QR Card
              </Button>
            )}
          </div>
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
                  <div><span className="text-muted-foreground block">School</span> <span className="font-medium">{data.school || "N/A"}</span></div>
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
                    <span className="text-muted-foreground block">Registration Payment Status</span>
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

              {/* Fee History */}
              {data.fees && data.fees.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-primary uppercase text-xs tracking-wider">Monthly Fee History</h3>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-2 rounded-tl-lg rounded-bl-lg">Month</th>
                          <th className="px-4 py-2">Due</th>
                          <th className="px-4 py-2">Paid</th>
                          <th className="px-4 py-2">Balance</th>
                          <th className="px-4 py-2 rounded-tr-lg rounded-br-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.fees.map((fee) => {
                          const date = new Date(fee.monthYear);
                          const monthStr = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                          const balance = Number(fee.total) - Number(fee.paid);
                          return (
                            <tr key={fee.id} className="border-b last:border-0 border-slate-200 dark:border-white/10">
                              <td className="px-4 py-3 font-medium">{monthStr}</td>
                              <td className="px-4 py-3">Rs. {Number(fee.total).toLocaleString()}</td>
                              <td className="px-4 py-3">Rs. {Number(fee.paid).toLocaleString()}</td>
                              <td className="px-4 py-3 text-red-500 font-medium">
                                {balance > 0 ? `Rs. ${balance.toLocaleString()}` : '0'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${
                                  fee.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 
                                  fee.status === 'PARTIAL' ? 'bg-amber-100 text-amber-700' : 
                                  fee.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 
                                  'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                                }`}>
                                  {fee.status === 'PARTIAL' ? 'PARTIALLY PAID' : fee.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* Enrollment History */}
              {data.enrollmentHistories && data.enrollmentHistories.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                  <h3 className="font-bold text-primary uppercase text-xs tracking-wider">Enrollment History</h3>
                  <div className="space-y-4">
                    {data.enrollmentHistories.map((history, idx) => (
                      <div key={history.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm border border-slate-200 dark:border-white/5">
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200 dark:border-white/10">
                          <div>
                            <span className="font-bold">Version {data.enrollmentHistories.length - idx}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              (Effective: {new Date(history.effectiveDate).toLocaleDateString()})
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            Changed by: {history.changedBy.fullName}<br />
                            Date: {new Date(history.changedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground block mb-2">Previous Enrollment</span>
                            <div className="space-y-1">
                              <p><span className="font-medium">Stream:</span> {history.previousStream || 'N/A'}</p>
                              <p><span className="font-medium">Monthly Fee:</span> Rs. {Number(history.previousMonthlyFee).toLocaleString()}</p>
                              <p className="font-medium mt-2">Subjects:</p>
                              <ul className="list-disc pl-4 text-xs">
                                {(history.previousSubjects as any[])?.map((sub, i) => (
                                  <li key={i}>{sub.subjectName} ({sub.teacherName || 'No Teacher'})</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-primary block mb-2">New Enrollment</span>
                            <div className="space-y-1">
                              <p><span className="font-medium">Stream:</span> {history.newStream || 'N/A'}</p>
                              <p><span className="font-medium">Monthly Fee:</span> Rs. {Number(history.newMonthlyFee).toLocaleString()}</p>
                              <p className="font-medium mt-2">Subjects:</p>
                              <ul className="list-disc pl-4 text-xs">
                                {(history.newSubjects as any[])?.map((sub, i) => (
                                  <li key={i}>{sub.subjectName} ({sub.teacherName || 'No Teacher'})</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showQRModal && data && (
        <GenerateQRModal
          studentId={data.id}
          studentName={data.user.fullName}
          studentCode={data.indexNumber || 'N/A'}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}
