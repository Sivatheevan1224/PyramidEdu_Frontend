"use client";

import { StudentManagementPage } from "@/modules/users/pages/StudentManagementPage";

export default function Page() {
  return (
    <StudentManagementPage
      title="Manager Students"
      description="Add new students, approve them after payment review, disable accounts, and inspect payment history."
    />
  );
}
