import { useState } from "react";
import { useRegisteredStudents } from "../hooks/useRegisteredStudents";
import RegisteredStudentsTable from "../Components/RegisteredStudentsTable";
import StudentDetailsModal from "../Components/StudentDetailsModal";
import { Loader2, RefreshCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisteredStudents() {
  const { data, loading, error, reload, handleUpdatePayment, handleUpdateApproval } = useRegisteredStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Newly Registered Students
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and approve new student registrations, and manage their initial admission payments.
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
        <RegisteredStudentsTable
          students={data}
          onViewDetails={setSelectedStudentId}
          onUpdatePayment={handleUpdatePayment}
          onUpdateApproval={handleUpdateApproval}
        />
      )}

      {selectedStudentId && (
        <StudentDetailsModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
}
