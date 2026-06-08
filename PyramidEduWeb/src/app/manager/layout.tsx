import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <DashboardLayout role="manager" title="Manager Dashboard">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
