import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <DashboardLayout role="admin" title="Admin Dashboard">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
