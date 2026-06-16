import { useEffect, useState } from "react";
import { fetchMyStudentDetails, TeacherStudentDetails } from "../services/teacherStudents.api";
import { Loader2, X, User, Phone, Mail, Award, CheckCircle, AlertTriangle, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  studentId: string;
  onClose: () => void;
}

export default function TeacherStudentDetailsModal({ studentId, onClose }: Props) {
  const [data, setData] = useState<TeacherStudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const details = await fetchMyStudentDetails(studentId);
        setData(details);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load student details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-white/10">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Student Profile Details</h2>
              <p className="text-xs text-muted-foreground">Detailed academic and attendance dashboard</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error || !data ? (
            <div className="text-center py-16 text-rose-500 flex flex-col items-center gap-2">
              <AlertTriangle className="h-10 w-10 text-rose-500" />
              <p className="font-semibold">{error}</p>
            </div>
          ) : (
            <>
              {/* Profile Card */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20 shrink-0 overflow-hidden">
                  {data.student.profileImage ? (
                    <img src={data.student.profileImage} alt={data.student.fullName} className="h-full w-full object-cover" />
                  ) : (
                    data.student.fullName.charAt(0)
                  )}
                </div>
                <div className="flex-1 space-y-4 w-full text-center md:text-left">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{data.student.fullName}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1">
                      <span className="bg-slate-200 dark:bg-slate-700 text-foreground px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        ID: {data.student.indexNumber || "Pending"}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        data.student.isActive 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {data.student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left pt-2 border-t border-slate-200/60 dark:border-white/5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate text-foreground font-medium">{data.student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground font-medium">{data.student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground font-medium">Batch: {data.student.batch}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance and Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Summary */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Attendance Breakdown</h4>
                  
                  {data.attendanceSummary.total === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No attendance records found</div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Sessions</span>
                        <span className="font-bold">{data.attendanceSummary.total}</span>
                      </div>
                      
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-emerald-500 h-full" 
                          style={{ width: `${(data.attendanceSummary.present / data.attendanceSummary.total) * 100}%` }} 
                        />
                        <div 
                          className="bg-amber-400 h-full" 
                          style={{ width: `${(data.attendanceSummary.late / data.attendanceSummary.total) * 100}%` }} 
                        />
                        <div 
                          className="bg-rose-500 h-full" 
                          style={{ width: `${(data.attendanceSummary.absent / data.attendanceSummary.total) * 100}%` }} 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-xl text-emerald-700 dark:text-emerald-400">
                          <CheckCircle className="h-4 w-4" />
                          <div>
                            <p className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-500">Present</p>
                            <p className="text-sm font-black">{data.attendanceSummary.present}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-xl text-amber-700 dark:text-amber-400">
                          <ClockIcon className="h-4 w-4" />
                          <div>
                            <p className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-500">Late</p>
                            <p className="text-sm font-black">{data.attendanceSummary.late}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 p-2 rounded-xl text-rose-700 dark:text-rose-400">
                          <AlertTriangle className="h-4 w-4" />
                          <div>
                            <p className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-500">Absent</p>
                            <p className="text-sm font-black">{data.attendanceSummary.absent}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl text-slate-700 dark:text-slate-400">
                          <HelpCircleIcon className="h-4 w-4" />
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-800 dark:text-slate-500">Excused</p>
                            <p className="text-sm font-black">{data.attendanceSummary.excused}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Academic Profile and Enrolled Subjects */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Academic Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-muted-foreground block text-xs">Selected Stream</span>
                      <span className="font-semibold text-foreground text-sm">{data.student.stream}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground block text-xs">School</span>
                      <span className="font-semibold text-foreground text-sm">{data.student.school || "N/A"}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                    <span className="text-muted-foreground block text-xs mb-2">Subject Registrations</span>
                    <ul className="space-y-2">
                      {data.student.enrollments.map((enr, i) => (
                        <li key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{enr.subjectName}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{enr.subjectCode}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground block">Teacher</span>
                            <span className="text-xs font-semibold text-foreground">{enr.teacherName}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Academic Performance (Results) */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Academic Performance (Latest Results)</h4>
                
                {data.academicPerformance.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-2xl text-muted-foreground">
                    No graded exam/quiz results recorded for this student yet.
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 text-muted-foreground border-b border-slate-200 dark:border-white/10">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Title / Activity</th>
                          <th className="px-5 py-3 font-semibold">Type</th>
                          <th className="px-5 py-3 font-semibold text-center">Marks</th>
                          <th className="px-5 py-3 font-semibold text-center">Grade</th>
                          <th className="px-5 py-3 font-semibold">Recorded Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {data.academicPerformance.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                            <td className="px-5 py-3 font-medium text-foreground">
                              <div>
                                {res.title}
                                {res.feedback && (
                                  <p className="text-[11px] text-muted-foreground font-normal mt-0.5 italic">
                                    "{res.feedback}"
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">{res.type}</td>
                            <td className="px-5 py-3 text-center font-bold text-foreground">{res.marks}%</td>
                            <td className="px-5 py-3 text-center">
                              <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-bold">
                                {res.grade || "N/A"}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">
                              {new Date(res.recordedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Parent Info */}
              {data.student.parent && (
                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Parent / Guardian Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                    <div>
                      <span className="text-muted-foreground block text-xs">Guardian Name</span>
                      <span className="font-semibold text-foreground">{data.student.parent.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Relation</span>
                      <span className="font-semibold text-foreground">{data.student.parent.relation || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Phone Number</span>
                      <span className="font-semibold text-foreground">{data.student.parent.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Email Address</span>
                      <span className="font-semibold text-foreground truncate block">{data.student.parent.email || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Internal SVG Icons for clean rendering without large packages
function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "h-4 w-4"}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

function HelpCircleIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "h-4 w-4"}>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}
