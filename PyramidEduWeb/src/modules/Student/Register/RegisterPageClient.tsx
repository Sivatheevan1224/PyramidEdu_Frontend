"use client";

import dynamic from "next/dynamic";
import { Logo } from "@/components/Logo";

const RegisterWizard = dynamic(
  () => import("@/modules/Student/Register/RegisterWizard"),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative grid min-h-screen place-items-center overflow-hidden bg-cover bg-center bg-no-repeat p-4"
        style={{ backgroundImage: "url('/signin_bg.png')" }}
      >
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />

        <div className="relative w-full max-w-3xl">
          <div className="mb-6 flex justify-center">
            <Logo
              textClassName="dark:text-slate-900"
              eduClassName="logo-edu-dark"
            />
          </div>
          <div className="bg-background border rounded-2xl p-8 shadow-elegant text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Loading registration form...
            </p>
          </div>
        </div>
      </div>
    ),
  },
);

export default function RegisterPageClient() {
  return <RegisterWizard />;
}
