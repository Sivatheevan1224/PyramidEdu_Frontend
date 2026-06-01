"use client";

import dynamic from "next/dynamic";
import { Logo } from "@/components/Logo";

const RegisterWizard = dynamic(
  () => import("@/modules/Student/Register/RegisterWizard"),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative grid min-h-screen place-items-center overflow-hidden bg-cover bg-center bg-no-repeat p-4 py-10"
        style={{ backgroundImage: "url('/signin_bg.png')" }}
      >
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs" />
        <div className="relative z-10 w-full max-w-xl">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <div className="glass-premium rounded-3xl border border-white/40 p-8 text-center shadow-2xl">
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
