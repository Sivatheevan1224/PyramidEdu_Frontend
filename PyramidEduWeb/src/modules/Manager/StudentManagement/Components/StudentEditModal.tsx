import { useEffect, useState } from "react";
import { fetchStudentDetails, updateStudentDetails } from "../services/api";
import { StudentDetails } from "../../newRegisteredStudents/types";
import { Loader2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  studentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentEditModal({ studentId, onClose, onSuccess }: Props) {
  const [data, setData] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const details = await fetchStudentDetails(studentId);
        setData(details);
        setFormData({
          fullName: details.user.fullName,
          phone: details.phone || "",
          email: details.user.email,
          address: details.address || "",
          dateOfBirth: details.dateOfBirth ? details.dateOfBirth.split('T')[0] : "",
          gender: details.gender || "",
          parentName: details.parent?.parentName || "",
          parentPhone: details.parent?.phone || "",
          parentEmail: details.parent?.email || "",
        });
      } catch (err: any) {
        toast.error("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateStudentDetails(studentId, formData);
      toast.success("Student updated successfully.");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update student.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Student Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={saving}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !data ? (
            <p className="text-red-500 text-center py-10">Data not found.</p>
          ) : (
            <>
              {/* Common Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-primary uppercase text-xs tracking-wider">Common Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900">
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border text-sm" />
                  </div>
                </div>
              </div>

              {/* Parent Details */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <h3 className="font-bold text-primary uppercase text-xs tracking-wider">Parent Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Parent Name</label>
                    <input name="parentName" value={formData.parentName} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Parent Phone</label>
                    <input name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Parent Email</label>
                    <input name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border text-sm" />
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-xs mt-4">
                Note: Editing Academic Details (Stream, Subjects, Teachers) must be done through a separate re-enrollment process to preserve billing integrity.
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
