import { useEffect, useState, useMemo } from "react";
import { fetchStudentDetails } from "../../newRegisteredStudents/services/api";
import { reEnrollStudent } from "../services/api";
import { StudentDetails } from "../../newRegisteredStudents/types";
import { useAcademicData } from "../../../Student/Register/hooks";
import { fetchTeachersForSubject } from "../../../Student/Register/services";
import { TeacherOption } from "../../../Student/Register/types";
import { Loader2, X, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MIN_SUBJECTS, MAX_SUBJECTS } from "../../../Student/Register/constants";

interface Props {
  studentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReEnrollmentModal({ studentId, onClose, onSuccess }: Props) {
  const [data, setData] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Selections
  const [selectedStreamId, setSelectedStreamId] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<Record<string, string>>({});
  const [teachersBySubject, setTeachersBySubject] = useState<Record<string, TeacherOption[]>>({});
  const [loadingTeachers, setLoadingTeachers] = useState<Record<string, boolean>>({});
  const [effectiveDate, setEffectiveDate] = useState("");

  const { streams, streamsLoading, subjects, subjectsLoading } = useAcademicData();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const details = await fetchStudentDetails(studentId);
        setData(details);
        
        // Match existing stream and set today as default effective date
        const streamInfo = streams.find(s => s.name === details.stream?.streamName);
        if (streamInfo) {
          setSelectedStreamId(streamInfo.id);
        }

        const today = new Date();
        setEffectiveDate(today.toISOString().split('T')[0]);
      } catch (err: any) {
        toast.error("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };
    if (streams.length > 0) {
      load();
    }
  }, [studentId, streams]);

  const filteredSubjects = useMemo(() => {
    if (!selectedStreamId) return [];
    return subjects.filter((subject) => {
      if (!subject.streamNames || subject.streamNames.length === 0) return true;
      const selectedStream = streams.find((s) => s.id === selectedStreamId);
      return selectedStream && subject.streamNames.includes(selectedStream.name);
    });
  }, [subjects, selectedStreamId, streams]);

  const handleSubjectToggle = async (subjectId: string) => {
    const isCurrentlySelected = selectedCourseIds.includes(subjectId);

    if (isCurrentlySelected) {
      // Removing
      setSelectedCourseIds((prev) => prev.filter((id) => id !== subjectId));
      const newTeachers = { ...selectedTeacherIds };
      delete newTeachers[subjectId];
      setSelectedTeacherIds(newTeachers);
    } else {
      // Adding
      if (selectedCourseIds.length >= MAX_SUBJECTS) {
        toast.error(`Maximum ${MAX_SUBJECTS} subjects allowed`);
        return;
      }
      
      setSelectedCourseIds((prev) => [...prev, subjectId]);

      // Fetch teachers if not already cached
      if (!teachersBySubject[subjectId]) {
        setLoadingTeachers((prev) => ({ ...prev, [subjectId]: true }));
        try {
          const data = await fetchTeachersForSubject(subjectId);
          setTeachersBySubject((prev) => ({ ...prev, [subjectId]: data }));
        } catch (err) {
          toast.error("Failed to fetch teachers for subject.");
        } finally {
          setLoadingTeachers((prev) => ({ ...prev, [subjectId]: false }));
        }
      }
    }
  };

  const handleTeacherSelect = (subjectId: string, teacherId: string) => {
    setSelectedTeacherIds((prev) => ({
      ...prev,
      [subjectId]: teacherId,
    }));
  };

  // Calculate new monthly fee
  const newMonthlyFee = useMemo(() => {
    return selectedCourseIds.reduce((total, id) => {
      const subject = subjects.find(s => s.id === id);
      return total + (subject ? Number(subject.monthlyFee) : 0);
    }, 0);
  }, [selectedCourseIds, subjects]);

  const handleSave = async () => {
    if (!selectedStreamId) {
      return toast.error("Please select a stream.");
    }
    if (selectedCourseIds.length < MIN_SUBJECTS || selectedCourseIds.length > MAX_SUBJECTS) {
      return toast.error(`Please select between ${MIN_SUBJECTS} and ${MAX_SUBJECTS} subjects.`);
    }
    if (selectedCourseIds.some(id => !selectedTeacherIds[id])) {
      return toast.error("Please assign a teacher to all selected subjects.");
    }
    if (!effectiveDate) {
      return toast.error("Please select an effective date.");
    }

    const payload = {
      streamId: selectedStreamId,
      newStreamName: streams.find(s => s.id === selectedStreamId)?.name,
      subjects: selectedCourseIds.map(id => ({
        subjectId: id,
        teacherId: selectedTeacherIds[id]
      })),
      effectiveDate
    };

    setSaving(true);
    try {
      await reEnrollStudent(studentId, payload);
      toast.success("Student successfully re-enrolled.");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to re-enroll student.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Student Re-Enrollment</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={saving}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 text-sm flex flex-col gap-6">
          {loading || streamsLoading || subjectsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !data ? (
            <p className="text-red-500 text-center py-10">Data not found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Current Details (Read Only) */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl">
                <h3 className="font-bold text-muted-foreground uppercase text-xs tracking-wider border-b pb-2">
                  Current Academic Details
                </h3>
                
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Current Stream</span>
                  <span className="font-semibold text-base">{data.stream?.streamName || "N/A"}</span>
                </div>
                
                <div>
                  <span className="text-xs text-muted-foreground block mb-2">Current Subjects & Teachers</span>
                  <ul className="space-y-2">
                    {data.enrollments.map((enr, i) => (
                      <li key={i} className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
                        <span className="font-semibold block">{enr.subject.subjectName}</span>
                        <span className="text-muted-foreground">Teacher: {enr.teacher?.user.fullName || "Unassigned"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                  <span className="text-xs text-muted-foreground block">Current Monthly Fee</span>
                  <span className="font-bold text-lg">Rs. {Number(data.totalFeeAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* Right Column: New Selections */}
              <div className="space-y-4">
                <h3 className="font-bold text-primary uppercase text-xs tracking-wider border-b pb-2">
                  New Academic Details
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-semibold block">Select New Stream</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-950"
                    value={selectedStreamId}
                    onChange={(e) => {
                      setSelectedStreamId(e.target.value);
                      setSelectedCourseIds([]);
                      setSelectedTeacherIds({});
                    }}
                  >
                    <option value="">-- Select Stream --</option>
                    {streams.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold block">
                    Select Subjects (Min: {MIN_SUBJECTS}, Max: {MAX_SUBJECTS})
                  </label>
                  {filteredSubjects.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Please select a stream first.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1">
                      {filteredSubjects.map((sub) => {
                        const isSelected = selectedCourseIds.includes(sub.id);
                        return (
                          <div key={sub.id} className={`p-3 rounded-xl border transition-colors ${isSelected ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSubjectToggle(sub.id)}
                                className="w-4 h-4 rounded text-primary"
                              />
                              <div className="flex-1">
                                <span className="font-semibold text-sm">{sub.name}</span>
                                <span className="text-xs text-muted-foreground block">Rs. {Number(sub.monthlyFee).toLocaleString()}</span>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="mt-2">
                                {loadingTeachers[sub.id] ? (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Loading teachers...
                                  </div>
                                ) : (
                                  <select
                                    className="w-full px-2 py-1 text-xs rounded border bg-white dark:bg-slate-900"
                                    value={selectedTeacherIds[sub.id] || ""}
                                    onChange={(e) => handleTeacherSelect(sub.id, e.target.value)}
                                  >
                                    <option value="">Select Teacher...</option>
                                    {teachersBySubject[sub.id]?.map((t) => (
                                      <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
                  <label className="text-xs font-semibold block text-red-500">Effective Date</label>
                  <p className="text-[10px] text-muted-foreground mb-1 leading-tight">
                    Billing, attendance, and new history records will be generated based on this date.
                  </p>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  />
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400">New Monthly Fee</span>
                    <span className="font-black text-xl text-emerald-700 dark:text-emerald-300">Rs. {newMonthlyFee.toLocaleString()}</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Confirm Re-Enrollment
          </Button>
        </div>
      </div>
    </div>
  );
}
