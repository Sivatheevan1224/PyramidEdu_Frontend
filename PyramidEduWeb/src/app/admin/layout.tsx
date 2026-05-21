import { DashboardLayout } from "@/components/DashboardLayout";
export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="admin" title="Admin Dashboard">{children}</DashboardLayout>;
}
