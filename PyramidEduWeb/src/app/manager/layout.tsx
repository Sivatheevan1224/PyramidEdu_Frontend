import { DashboardLayout } from "@/components/DashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="admin" title="Manager Dashboard">{children}</DashboardLayout>;
}
