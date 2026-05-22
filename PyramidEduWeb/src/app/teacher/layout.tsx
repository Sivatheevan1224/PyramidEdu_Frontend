import { DashboardLayout } from "@/components/DashboardLayout";
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="teacher" title="Teacher Dashboard">{children}</DashboardLayout>;
}
