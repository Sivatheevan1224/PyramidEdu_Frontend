import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ContactUsForm } from "@/components/ContactUsForm";
import {
  Brain,
  FileText,
  BarChart3,
  GraduationCap,
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  Bell,
  Sparkles,
  ArrowRight,
  Shield,
  Users,
  Bot,
  QrCode,
  FileCheck2,
  Wallet,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { TeachersSection } from "@/components/TeachersSection";

const heroFeatures = [
  {
    icon: Brain,
    title: "AI Chatbot",
    subtitle: "Smart Assistance",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-100 dark:border-purple-900/30",
  },
  {
    icon: FileText,
    title: "PDF Summary",
    subtitle: "& Questions",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-100 dark:border-blue-900/30",
  },
  {
    icon: BarChart3,
    title: "Performance",
    subtitle: "Insights",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-100 dark:border-violet-900/30",
  },
  {
    icon: GraduationCap,
    title: "Smart Learning",
    subtitle: "Support",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "border-indigo-100 dark:border-indigo-900/30",
  },
];

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

const roleCards = [
  {
    icon: Shield,
    label: "Admin",
    title: "Admin Control Panel",
    desc: "Govern the institute from a single command center.",
    accent: "from-blue-600 to-violet-600",
    items: [
      {
        icon: Users,
        text: "Manage users, permissions, and approvals across the platform.",
      },
      {
        icon: Wallet,
        text: "Monitor fees, payroll, and overall financial activity.",
      },
      {
        icon: BarChart3,
        text: "Review analytics, reports, and institute-wide performance.",
      },
    ],
  },
  {
    icon: Users,
    label: "Manager",
    title: "Manager Operations System",
    desc: "Keep daily academic and administrative work on track.",
    accent: "from-violet-600 to-indigo-500",
    items: [
      {
        icon: ClipboardList,
        text: "Handle students, subjects, and routine coordination tasks.",
      },
      {
        icon: QrCode,
        text: "Oversee attendance, marks, and class-level records.",
      },
      {
        icon: FileText,
        text: "Review reports, notices, and workflow updates.",
      },
    ],
  },
  {
    icon: GraduationCap,
    label: "Teacher",
    title: "Teacher Academic Dashboard",
    desc: "Manage classes and guide students with smart teaching tools.",
    accent: "from-indigo-600 to-blue-500",
    items: [
      {
        icon: QrCode,
        text: "Take QR attendance and update class presence instantly.",
      },
      {
        icon: FileCheck2,
        text: "Create quizzes, grade work, and publish results.",
      },
      {
        icon: Bot,
        text: "Use AI chat, notes, and prediction support.",
      },
    ],
  },
  {
    icon: BookOpen,
    label: "Student",
    title: "Student Learning Portal",
    desc: "Stay on top of learning, progress, and communication.",
    accent: "from-blue-500 to-violet-500",
    items: [
      {
        icon: CalendarCheck2,
        text: "Check timetable, attendance, and announcements.",
      },
      {
        icon: BarChart3,
        text: "Review performance, recommendations, and growth.",
      },
      {
        icon: Bell,
        text: "Follow notifications, fees, and study materials.",
      },
    ],
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative bg-[url('/bg_light_edu.png')] bg-cover bg-center bg-no-repeat bg-fixed dark:bg-none"
    >
      {/* Light/Dark Overlay for Readability */}
      <div className="fixed inset-0 -z-50 bg-white/90 dark:bg-slate-950/90 pointer-events-none mix-blend-normal"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/40 dark:bg-purple-900/10 blur-[120px]" />
          <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-200/30 dark:bg-blue-900/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-200/20 dark:bg-indigo-900/5 blur-[100px]" />
        </div>

        <div className="container px-4 mx-auto">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="flex flex-col justify-center lg:col-span-5 xl:col-span-5 text-left z-10">
              {/* Badge/Tag with floating sparkles */}
              <div className="relative w-fit">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] px-4 py-1.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_4px_20px_rgba(79,70,229,0.4)] transition-all duration-300">
                  <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
                  <span>AI-Powered Education</span>
                </div>
                {/* Floating design sparkles as shown in the image */}
                <div className="absolute -top-4 -right-10 flex items-center gap-1.5 pointer-events-none select-none">
                  <svg
                    className="w-5 h-5 text-[#818cf8] animate-pulse"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="w-3.5 h-3.5 text-[#c7d2fe] animate-ping duration-1000 delay-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              {/* Logo / Title */}
              <h1 className="mt-6 text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent leading-[1.05] font-sans">
                PyramidEdu
              </h1>

              {/* Subheading */}
              <h2 className="mt-4 text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-sans">
                Smart Institute Management &<br />
                Student Performance Prediction System
              </h2>

              {/* Paragraph Description */}
              <p className="mt-5 text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                Empowering students and educators with AI-driven insights, smart
                analytics, and intelligent learning.
              </p>

              {/* 4 Cards Grid - Responsive Row Layout */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {heroFeatures.map((hf) => (
                  <div
                    key={hf.title}
                    className="flex flex-col items-center p-4 text-center bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(99,102,241,0.08)] hover:bg-white dark:hover:bg-slate-900 hover:border-violet-100 dark:hover:border-violet-950/50 group"
                  >
                    <div
                      className={`p-3 rounded-2xl ${hf.bgColor} ${hf.iconColor} mb-3 group-hover:scale-105 transition-transform duration-300`}
                    >
                      <hf.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 block leading-tight font-sans">
                      {hf.title}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block leading-tight mt-0.5">
                      {hf.subtitle}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-row items-center gap-4">
                <Button
                  asChild
                  className="rounded-full h-12 px-8 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(79,70,229,0.5)] transition-all duration-300 group cursor-pointer"
                >
                  <Link href="/login">
                    Get Started
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full h-12 px-8 text-xs font-bold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.05)] transition-all duration-300 group cursor-pointer"
                >
                  <Link href="#features">
                    Explore Features
                    <ChevronRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Handwritten signature with stroke */}
              <div className="mt-8 flex flex-col items-start pl-2 select-none pointer-events-none">
                <span className="font-signature text-2xl md:text-3xl text-[#4f46e5] dark:text-indigo-400 rotate-[-1.5deg]">
                  Learn Smarter. Achieve Better.
                </span>
                {/* Handdrawn line svg */}
                <svg
                  className="w-52 h-2.5 text-indigo-400/80 dark:text-indigo-400/40 -mt-1 ml-1"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q50,9 100,3"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Right Column (Hero Banner Image) */}
            <div className="relative w-full lg:col-span-7 xl:col-span-7 flex justify-center items-center mt-12 lg:mt-0 px-4 md:px-8">
              {/* Background gradient lights */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] -z-20 pointer-events-none overflow-visible">
                <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-violet-400/20 dark:bg-violet-900/10 blur-[90px] animate-pulse-glow" />
                <div
                  className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-400/25 dark:bg-blue-900/10 blur-[90px] animate-pulse-glow"
                  style={{ animationDelay: "2s" }}
                />
              </div>

              {/* Dark Banner Image */}
              <div className="relative w-full max-w-[650px] aspect-[16/10] flex items-center justify-center z-10 rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(37,99,235,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.2)] transition-all duration-500 hover:-translate-y-1 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-violet-900/40 z-10 mix-blend-overlay"></div>
                <Image
                  src="/hero_dark.png"
                  alt="Modern Data-Driven Academic Environment"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <AnimatedSection
        id="features"
        className="relative py-24 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-900/50 transition-colors duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-multiply dark:hidden pointer-events-none">
          <Image src="/bg_light_edu.png" alt="Education background" fill className="object-cover" />
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

      {/* Role-based experience Section */}
      <AnimatedSection
        id="roles"
        className="relative py-24 bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-10 mix-blend-multiply dark:hidden pointer-events-none">
          <Image src="/bg_light_edu.png" alt="Education background" fill className="object-cover" />
        </div>
        <div className="relative container px-4 mx-auto z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl tracking-tight text-slate-900 dark:text-white font-sans">
              Built for every role, explained clearly
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Each dashboard focuses on the tasks that matter most while the
              core platform handles AI, attendance, exams, finance, and
              security.
            </p>
          </div>

          <div className="mt-16 grid gap-8 xl:grid-cols-2">
            {roleCards.map((role) => (
              <Card
                key={role.title}
                className="group relative overflow-hidden h-full bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800/80 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${role.accent}`}
                />

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br ${role.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
                  >
                    <role.icon className="h-7 w-7" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                      {role.label}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans">
                      {role.title}
                    </h3>
                    <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                      {role.desc}
                    </p>
                  </div>
                </div>

                <ul className="mt-8 space-y-3">
                  {role.items.map((item) => (
                    <li
                      key={item.text}
                      className="flex items-start gap-3 rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-950/40"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                        <item.icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="pt-0.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <feature.icon className="h-4 w-4 text-violet-500" />
                <span className="font-medium">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* About Us Section */}
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

          {/* Meet the Team - Inside About Section */}
          <div className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Meet the Team</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">The dedicated developers behind PyramidEdu. Built by students from Uva Wellassa University.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Arulnathan Sivatheevan", id: "UWU/CST/22/083" },
                { name: "Sathananthan Makinthan", id: "UWU/CST/22/087" },
                { name: "Yoganathan Pukaliny", id: "UWU/CST/22/097" },
                { name: "Kantharuban Kowsika", id: "UWU/CST/22/108" },
              ].map((member) => (
                <div
                  key={member.id}
                  className="text-center p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">{member.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">{member.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Us Section */}
      <AnimatedSection
        id="contact"
        className="py-24 bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300"
      >
        <div className="container px-4 mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl tracking-tight text-slate-900 dark:text-white font-sans">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Have a question or feedback? Fill out the form below to contact
              our admin team.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <Card className="p-8 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-xl shadow-indigo-500/5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Institute Contact
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans">
                    Director Details
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Director
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-800 dark:text-slate-100">
                    S. Kajeepan
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                      Phone
                    </p>
                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                      0774857896
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                      Email
                    </p>
                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100 break-all">
                      pyramideducation06@gmail.com
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 px-4 py-3 sm:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                      Location
                    </p>
                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                      Kopay South, Jaffna
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Address
                  </p>
                  <p className="mt-1 text-slate-800 dark:text-slate-100 font-semibold">
                    Pyramid Education Center, Kopay South, Jaffna, Sri Lanka.
                  </p>
                </div>

              </div>
            </Card>

            <Card className="p-8 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-xl shadow-indigo-500/5 backdrop-blur-sm">
              <ContactUsForm />
            </Card>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
