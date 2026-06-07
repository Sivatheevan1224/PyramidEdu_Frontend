import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "TEACHER"]}>
      {children}
    </ProtectedRoute>
  );
}
