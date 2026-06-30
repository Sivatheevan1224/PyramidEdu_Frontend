import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Cpu, QrCode, Wallet } from "lucide-react";
import { TeachersSection } from "./TeachersSection";

export function AboutSection() {
  return (
    <AnimatedSection
      id="about"
      className="py-24 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-900/50 transition-colors duration-300"
    >
      <div className="container px-4 mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl tracking-tight text-slate-900 dark:text-white font-sans">
            About PyramidEdu
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            A centralized platform to support the academic and administrative
            operations of modern educational institutes.
          </p>
        </div>
        <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-last md:order-first">
            <Card className="relative bg-slate-50/50 dark:bg-slate-900/50 p-8 border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-lg backdrop-blur-sm">
              <p className="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                PyramidEdu addresses inefficiencies in educational centers
                like manual records, fragmented data, and poor communication
                by integrating modern tech and intelligent features.
              </p>
              <p className="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                It streamlines student and subject management, QR-based
                real-time attendance tracking, exams, and financial
                operations. The system also includes a mobile app for students
                to access records, progress, and notifications anywhere.
              </p>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 mt-6">
                <li className="flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-violet-500 shrink-0" />
                  <span className="font-semibold">
                    AI-Powered Insights & Predictions
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <QrCode className="w-6 h-6 text-violet-500 shrink-0" />
                  <span className="font-semibold">
                    Real-time QR Attendance Tracking
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-violet-500 shrink-0" />
                  <span className="font-semibold">
                    Automated Financial Management
                  </span>
                </li>
              </ul>
            </Card>
          </div>
          <div className="relative w-full h-80 md:h-full rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 group">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              alt="Our Team"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        <TeachersSection />
      </div>
    </AnimatedSection>
  );
}
