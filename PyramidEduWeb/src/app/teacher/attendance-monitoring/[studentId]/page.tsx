"use client";

import { use } from "react";
import { TeacherStudentDetails } from "@/modules/Teacher/AttendanceMonitoring/Components/TeacherStudentDetails";

export default function Page({ params }: { params: Promise<{ studentId: string }> }) {
  const unwrappedParams = use(params) as { studentId: string };
  return <TeacherStudentDetails studentId={unwrappedParams.studentId} />;
}
