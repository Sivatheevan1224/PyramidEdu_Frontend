import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import {
  Bot,
  QrCode,
  BarChart3,
  FileCheck2,
  Wallet,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Chatbot Assistance",
    desc: "24/7 intelligent assistant for students, staff and parents.",
  },
  {
    icon: QrCode,
    title: "QR Code Attendance",
    desc: "Scan-and-go attendance with live class roll and reports.",
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    desc: "ML-powered predictions to spot at-risk students early.",
  },
  {
    icon: FileCheck2,
    title: "Online Exams & Quizzes",
    desc: "Create, schedule, auto-grade and analyze exams.",
  },
  {
    icon: Wallet,
    title: "Fee & Salary Management",
    desc: "Automated invoices, payroll and reconciliations.",
  },
  {
    icon: Shield,
    title: "Role-based Security",
    desc: "Granular access for admins, teachers and students.",
  },
];

export function FeaturesSection() {
  return (
    <AnimatedSection
      id="features"
      className="relative py-24 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-900/50 transition-colors duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-15 mix-blend-multiply dark:hidden pointer-events-none">
        <Image src="/bg_light_edu.png" alt="Education background" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      <div className="relative container px-4 mx-auto z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl tracking-tight text-slate-900 dark:text-white font-sans">
            Everything your institute needs
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            A complete toolkit, designed for clarity and built for scale.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800/60 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5"
            >
              {/* Accent glow on hover */}
              <div className="absolute top-0 left-0 w-1.5 h-0 bg-linear-to-b from-violet-600 to-indigo-600 group-hover:h-full transition-all duration-300" />

              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-violet-600/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 transition-all duration-300 group-hover:bg-linear-to-r group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-md group-hover:scale-110">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors font-sans">
                {f.title}
              </h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                {f.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
