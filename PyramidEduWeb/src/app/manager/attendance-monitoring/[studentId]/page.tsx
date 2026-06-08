"use client";

import { use } from "react";
import { ManagerStudentDetails } from "@/modules/Manager/AttendanceMonitoring/Components/ManagerStudentDetails";

export default function Page({ params }: { params: Promise<{ studentId: string }> }) {
  const unwrappedParams = use(params) as { studentId: string };
  return <ManagerStudentDetails studentId={unwrappedParams.studentId} />;
}
