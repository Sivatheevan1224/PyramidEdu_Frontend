import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["TEACHER"]}>
      <DashboardLayout role="teacher" title="Teacher Dashboard">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
