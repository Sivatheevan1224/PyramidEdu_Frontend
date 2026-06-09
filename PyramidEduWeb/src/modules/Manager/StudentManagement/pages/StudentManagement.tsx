import { useState } from "react";
import { useStudentManagement } from "../hooks/useStudentManagement";
import StudentManagementTable from "../Components/StudentManagementTable";
import StudentDetailsModal from "../../newRegisteredStudents/Components/StudentDetailsModal";
import StudentQRCodeModal from "../../newRegisteredStudents/Components/StudentQRCodeModal";
import StudentEditModal from "../Components/StudentEditModal";
import ReEnrollmentModal from "../Components/ReEnrollmentModal";
import { Loader2, RefreshCcw, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApprovedStudent } from "../types";

export default function StudentManagement() {
  const { data, loading, error, reload, handleToggleStatus } = useStudentManagement();
  const [viewStudentId, setViewStudentId] = useState<string | null>(null);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [reEnrollStudentId, setReEnrollStudentId] = useState<string | null>(null);
  const [qrStudent, setQrStudent] = useState<any>(null);

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
        <Button onClick={reload} variant="outline" className="gap-2 shrink-0">
          <RefreshCcw className="h-4 w-4" /> Refresh Data
        </Button>
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
    </div>
  );
}
