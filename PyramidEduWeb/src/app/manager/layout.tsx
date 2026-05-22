import { DashboardLayout } from "@/components/DashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="manager" title="Manager Dashboard">{children}</DashboardLayout>;
}
