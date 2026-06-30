import { useState, useEffect } from "react";
import { useStudentManagement } from "../hooks/useStudentManagement";
import StudentManagementTable from "../Components/StudentManagementTable";
import StudentDetailsModal from "../../newRegisteredStudents/Components/StudentDetailsModal";
import StudentQRCodeModal from "../../newRegisteredStudents/Components/StudentQRCodeModal";
import StudentEditModal from "../Components/StudentEditModal";
import ReEnrollmentModal from "../Components/ReEnrollmentModal";
import StudentWizardModal from "@/modules/users/components/forms/StudentWizardModal";
import { Loader2, RefreshCcw, UserCheck, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApprovedStudent } from "../types";
import { api } from "@/lib/api";

export default function StudentManagement() {
  const { data, loading, error, reload, handleToggleStatus, filters } = useStudentManagement();
  const [viewStudentId, setViewStudentId] = useState<string | null>(null);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [reEnrollStudentId, setReEnrollStudentId] = useState<string | null>(null);
  const [qrStudent, setQrStudent] = useState<any>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const [batches, setBatches] = useState<{ id: string; batchName: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    api.get("/batches?activeOnly=true")
      .then((res) => {
        const payload = res.data;
        if (Array.isArray(payload?.data)) setBatches(payload.data);
        else if (Array.isArray(payload)) setBatches(payload);
      })
      .catch(console.error);

    api.get("/subjects/available")
      .then((res) => {
        const payload = res.data;
        if (Array.isArray(payload)) setSubjects(payload);
        else if (Array.isArray(payload?.data)) setSubjects(payload.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-emerald-600" />
            Student Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all approved students, view their details, update their records, and monitor monthly fees.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => setIsAddStudentOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <Plus className="h-4 w-4" /> Add Student
          </Button>
          <Button onClick={reload} variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" /> Refresh Data
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            placeholder="Search by name, email..."
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10"
          />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.indexNumber}
            onChange={(e) => filters.setIndexNumber(e.target.value)}
            placeholder="Search by Student ID..."
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10"
          />
        </div>

        <div>
          <select
            value={filters.batchId}
            onChange={(e) => filters.setBatchId(e.target.value)}
            aria-label="Filter by Batch"
            className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm focus:outline-none"
          >
            <option value="">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.batchName}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filters.subjectId}
            onChange={(e) => filters.setSubjectId(e.target.value)}
            aria-label="Filter by Subject"
            className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm focus:outline-none"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filters.status}
            onChange={(e) => filters.setStatus(e.target.value)}
            aria-label="Filter by Status"
            className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <StudentManagementTable
          students={data}
          onViewDetails={setViewStudentId}
          onEditStudent={setEditStudentId}
          onViewQR={(student: ApprovedStudent) => {
            setQrStudent({
              studentName: student.studentName,
              indexNumber: student.indexNumber,
              stream: student.stream,
              qrCode: student.qrCode,
            });
          }}
          onToggleStatus={handleToggleStatus}
          onReEnroll={setReEnrollStudentId}
        />
      )}

      {viewStudentId && (
        <StudentDetailsModal
          studentId={viewStudentId}
          onClose={() => setViewStudentId(null)}
          onQRGenerated={() => reload()}
        />
      )}

      {editStudentId && (
        <StudentEditModal
          studentId={editStudentId}
          onClose={() => setEditStudentId(null)}
          onSuccess={() => {
            setEditStudentId(null);
            reload();
          }}
        />
      )}

      {reEnrollStudentId && (
        <ReEnrollmentModal
          studentId={reEnrollStudentId}
          onClose={() => setReEnrollStudentId(null)}
          onSuccess={() => {
            setReEnrollStudentId(null);
            reload();
          }}
        />
      )}

      {qrStudent && (
        <StudentQRCodeModal
          studentName={qrStudent.studentName}
          indexNumber={qrStudent.indexNumber}
          stream={qrStudent.stream}
          qrCode={qrStudent.qrCode}
          onClose={() => setQrStudent(null)}
        />
      )}

      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden p-6">
            <StudentWizardModal
              onClose={() => setIsAddStudentOpen(false)}
              onSuccess={() => {
                setIsAddStudentOpen(false);
                reload();
              }}
              isAdminCreation={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
