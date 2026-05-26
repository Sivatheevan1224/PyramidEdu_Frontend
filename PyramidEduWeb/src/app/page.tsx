import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import {
  Brain,
  FileText,
  BarChart3,
  GraduationCap,
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
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-100 dark:border-emerald-900/30",
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

const roles = [
  {
    icon: Shield,
    title: "Admin Control Panel",
    desc: "Govern the entire institute, payments and analytics.",
    to: "/admin",
    accent: "from-purple-600 to-indigo-600",
  },
  {
    icon: Users,
    title: "Manager Operations System",
    desc: "Run day-to-day operations across departments.",
    to: "/manager",
    accent: "from-blue-600 to-cyan-500",
  },
  {
    icon: GraduationCap,
    title: "Teacher Academic Dashboard",
    desc: "Track classes, attendance and student performance.",
    to: "/teacher",
    accent: "from-emerald-600 to-teal-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafd] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
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
              <h1 className="mt-6 text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] dark:from-white dark:via-[#e0e7ff] dark:to-[#c7d2fe] bg-clip-text text-transparent leading-[1.05] font-lexend">
                PyramidEdu
              </h1>

              {/* Subheading */}
              <h2 className="mt-4 text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-lexend">
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
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 block leading-tight font-lexend">
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

            {/* Right Column (Interactive Visual) */}
            <div className="relative w-full lg:col-span-7 xl:col-span-7 flex justify-center items-center mt-12 lg:mt-0 px-4 md:px-8">
              {/* Background gradient lights */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] -z-20 pointer-events-none overflow-visible">
                <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-violet-400/20 dark:bg-violet-900/10 blur-[90px] animate-pulse-glow" />
                <div
                  className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-400/25 dark:bg-blue-900/10 blur-[90px] animate-pulse-glow"
                  style={{ animationDelay: "2s" }}
                />
                <div className="absolute top-[40%] left-[30%] w-62.5 h-62.5 rounded-full bg-indigo-400/15 dark:bg-indigo-900/5 blur-[80px]" />
              </div>

              {/* Decorative elements: floating graduation cap SVG in background */}
              <div className="absolute -top-10 left-[25%] opacity-85 animate-float-slow select-none pointer-events-none z-0">
                <div className="text-indigo-400/60 dark:text-indigo-400/30">
                  <svg
                    className="w-16 h-16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 3L1 9L12 15L21.5 9.8L21.5 15.5L23 15.5L23 9L12 3ZM12 4.6L19.2 8.5L12 12.4L4.8 8.5L12 4.6ZM5 10.3L5 15C5 17.2 8.1 19 12 19C15.9 19 19 17.2 19 15L19 10.3L12 14.1L5 10.3Z" />
                  </svg>
                </div>
              </div>

              {/* Decorative elements: floating translucent blue 3D cube near the bottom left */}
              <div className="absolute -bottom-8 left-[5%] opacity-90 animate-float-medium select-none pointer-events-none z-5">
                <div className="w-12 h-12 bg-linear-to-br from-blue-400/30 to-indigo-600/30 border border-white/20 rounded-xl shadow-lg backdrop-blur-xs transform rotate-12 flex items-center justify-center">
                  <div className="w-6 h-6 bg-linear-to-br from-blue-300 to-indigo-500 rounded-md opacity-70" />
                </div>
              </div>

              {/* Decorative Sparkles */}
              <div className="absolute top-1/4 -right-4 opacity-75 animate-pulse select-none pointer-events-none z-20">
                <svg
                  className="w-5 h-5 text-indigo-400"
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

              {/* Composite Scene container */}
              <div className="relative w-full max-w-[650px] aspect-[4/3] flex items-center justify-center z-10">
                {/* Dashboard Coded Mockup (Glassmorphism Window) - Placed in the background */}
                <div className="absolute right-[-4%] top-0 w-[78%] h-[95%] z-10 bg-white/70 dark:bg-slate-950/80 border border-white/30 dark:border-slate-800/60 rounded-[1.8rem] shadow-[0_25px_60px_rgba(20,20,40,0.12)] backdrop-blur-xl overflow-hidden flex flex-row">
                  {/* Mockup Sidebar */}
                  <div className="w-[30%] bg-[#0d0e26] border-r border-[#1e204a]/30 flex flex-col p-3 text-white">
                    <div className="flex items-center gap-1.5 mb-5 px-1">
                      <div className="w-5 h-5 bg-linear-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] font-bold">P</span>
                      </div>
                      <span className="text-[10px] font-bold tracking-wide">
                        PyramidEdu
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-[9px] font-semibold text-[#8a8cb3]">
                      <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#4f46e5] text-white">
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="7" height="9" />
                          <rect x="14" y="3" width="7" height="5" />
                          <rect x="14" y="12" width="7" height="9" />
                          <rect x="3" y="16" width="7" height="5" />
                        </svg>
                        <span>Dashboard</span>
                      </div>
                      {[
                        { label: "Attendance", path: "M9 11l3 3L22 4" },
                        {
                          label: "Assignments",
                          path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2",
                        },
                        {
                          label: "Quizzes",
                          path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                        },
                        {
                          label: "Exams",
                          path: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253",
                        },
                        {
                          label: "Reports",
                          path: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                        },
                        {
                          label: "AI Assistant",
                          path: "M12 2a5 5 0 00-5 5v3a5 5 0 0010 0V7a5 5 0 00-5-5z",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1a1c3d] hover:text-[#c7d2fe] transition-colors cursor-pointer"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d={item.path} />
                          </svg>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mockup Main Screen */}
                  <div className="flex-1 p-3.5 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
                    {/* Header of mockup */}
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-extrabold text-slate-800 dark:text-white leading-tight">
                          Welcome back!
                        </span>
                        <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 leading-tight">
                          Let's learn something new today.
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer">
                          <svg
                            className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ef4444] rounded-full ring-1 ring-white dark:ring-slate-950 animate-pulse" />
                        </div>
                        <div className="w-5 h-5 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 border border-white flex items-center justify-center text-[8px] text-white font-bold cursor-pointer">
                          A
                        </div>
                      </div>
                    </div>

                    {/* Dashboard KPI Grid */}
                    <div className="grid grid-cols-4 gap-1.5 mb-3.5">
                      {[
                        {
                          title: "Attendance",
                          val: "92%",
                          grad: "from-[#3b82f6] to-[#60a5fa]",
                        },
                        {
                          title: "Quiz Avg.",
                          val: "82%",
                          grad: "from-[#8b5cf6] to-[#a78bfa]",
                        },
                        {
                          title: "Assignments",
                          val: "88%",
                          grad: "from-[#f97316] to-[#fb923c]",
                        },
                        {
                          title: "Exam Avg.",
                          val: "85%",
                          grad: "from-[#10b981] to-[#34d399]",
                        },
                      ].map((kpi) => (
                        <div
                          key={kpi.title}
                          className={`p-1.5 rounded-xl bg-linear-to-br ${kpi.grad} text-white flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.04)]`}
                        >
                          <span className="text-[6px] font-bold uppercase opacity-85">
                            {kpi.title}
                          </span>
                          <span className="text-xs font-black mt-0.5 leading-tight">
                            {kpi.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Chart Panel */}
                    <div className="flex-1 bg-white/50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-2 flex flex-col min-h-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-extrabold text-slate-700 dark:text-slate-200">
                          Performance Overview
                        </span>
                        <div className="flex items-center gap-0.5 text-[7px] font-bold text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800/60 rounded px-1 py-0.5 bg-white/80 dark:bg-slate-950/60">
                          <span>This Month</span>
                          <svg
                            className="w-1.5 h-1.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M7 10l5 5 5-5H7z" />
                          </svg>
                        </div>
                      </div>

                      {/* SVG Line Chart */}
                      <div className="flex-1 relative w-full h-full min-h-0 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl overflow-hidden flex items-end">
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 40"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id="chartGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#4f46e5"
                                stopOpacity="0.25"
                              />
                              <stop
                                offset="100%"
                                stopColor="#4f46e5"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line
                            x1="0"
                            y1="10"
                            x2="100"
                            y2="10"
                            stroke="#f1f5f9"
                            strokeWidth="0.3"
                            className="dark:stroke-slate-800/40"
                            opacity="0.4"
                          />
                          <line
                            x1="0"
                            y1="20"
                            x2="100"
                            y2="20"
                            stroke="#f1f5f9"
                            strokeWidth="0.3"
                            className="dark:stroke-slate-800/40"
                            opacity="0.4"
                          />
                          <line
                            x1="0"
                            y1="30"
                            x2="100"
                            y2="30"
                            stroke="#f1f5f9"
                            strokeWidth="0.3"
                            className="dark:stroke-slate-800/40"
                            opacity="0.4"
                          />
                          {/* Area Gradient */}
                          <path
                            d="M 0 40 L 0 32 Q 20 22 40 28 T 80 12 L 100 8 L 100 40 Z"
                            fill="url(#chartGrad)"
                          />
                          {/* Bezier Path */}
                          <path
                            d="M 0 32 Q 20 22 40 28 T 80 12 L 100 8"
                            fill="none"
                            stroke="#4f46e5"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                          {/* Glowing points */}
                          <circle
                            cx="40"
                            cy="28"
                            r="1.5"
                            fill="#4f46e5"
                            stroke="#ffffff"
                            strokeWidth="0.5"
                            className="animate-pulse"
                          />
                          <circle
                            cx="80"
                            cy="12"
                            r="1.5"
                            fill="#4f46e5"
                            stroke="#ffffff"
                            strokeWidth="0.5"
                            className="animate-pulse"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom stats layout of mockup */}
                    <div className="grid grid-cols-12 gap-2 mt-2 items-center">
                      {/* Recent Activities */}
                      <div className="col-span-8 bg-white/40 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-xl p-1.5 text-[7px] font-semibold text-slate-500 dark:text-slate-400 flex flex-col gap-1">
                        <span className="text-[8px] font-extrabold text-slate-700 dark:text-slate-200">
                          Recent Activities
                        </span>
                        {[
                          {
                            title: "Quiz Completed",
                            desc: "Data Structures",
                            date: "Today",
                            bg: "bg-purple-500",
                            text: "text-purple-600 dark:text-purple-400",
                          },
                          {
                            title: "Assignment Submitted",
                            desc: "Database Systems",
                            date: "Yesterday",
                            bg: "bg-blue-500",
                            text: "text-blue-600 dark:text-blue-400",
                          },
                        ].map((act) => (
                          <div
                            key={act.title}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${act.bg}`}
                              />
                              <div className="flex flex-col">
                                <span className="text-[7px] font-extrabold text-slate-700 dark:text-slate-300 leading-tight">
                                  {act.title}
                                </span>
                                <span className="text-[6px] font-medium text-slate-400 dark:text-slate-500 leading-tight">
                                  {act.desc}
                                </span>
                              </div>
                            </div>
                            <span className="text-[5px] text-slate-400 dark:text-slate-500">
                              {act.date}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Overall Progress ring */}
                      <div className="col-span-4 bg-white/40 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-xl p-1.5 flex flex-col items-center justify-center">
                        <div className="relative w-9 h-9 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="18"
                              cy="18"
                              r="14"
                              stroke="#e2e8f0"
                              strokeWidth="2.5"
                              fill="transparent"
                              className="dark:stroke-slate-800"
                            />
                            <circle
                              cx="18"
                              cy="18"
                              r="14"
                              stroke="url(#kpiCircleGrad)"
                              strokeWidth="2.5"
                              fill="transparent"
                              strokeDasharray="88"
                              strokeDashoffset="13"
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient
                                id="kpiCircleGrad"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#3b82f6" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                            <span className="text-[9px] font-black text-slate-800 dark:text-white">
                              85%
                            </span>
                            <span className="text-[5px] font-semibold text-[#8b5cf6] scale-[0.8] mt-0.5">
                              Overall
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3D Student and Robot Illustration - Brought to front */}
                <div className="absolute left-[-10%] bottom-[-5%] w-[85%] h-[90%] z-20 select-none pointer-events-none">
                  <div className="relative w-full h-full rounded-4xl overflow-hidden">
                    <Image
                      src="/students-robot.png"
                      alt="Students and AI Robot Illustration"
                      fill
                      priority
                      className="object-contain object-bottom"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Floating Tooltip Pill bubbles */}

                {/* Purple Chat Bubble: AI Chatbot Ask anything */}
                <div className="absolute top-[8%] left-[5%] z-30 animate-float-slow select-none pointer-events-none">
                  <div className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 text-white px-3.5 py-1.5 shadow-[0_8px_20px_rgba(139,92,246,0.25)] border border-white/25">
                    <div className="w-3.5 h-3.5 bg-white/25 rounded-full flex items-center justify-center">
                      <svg
                        className="w-2 h-2 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[8px] font-black uppercase tracking-wide">
                        AI Chatbot
                      </span>
                      <span className="text-[6.5px] font-semibold opacity-90 mt-0.5">
                        Ask anything
                      </span>
                    </div>
                  </div>
                </div>

                {/* Blue Rectangular Capsule: Upload PDF Get Summary */}
                <div
                  className="absolute top-[32%] left-[-8%] z-30 animate-float-medium select-none pointer-events-none"
                  style={{ animationDelay: "1.5s" }}
                >
                  <div className="flex items-center gap-1.5 rounded-full bg-[#3b82f6] text-white px-3.5 py-1.5 shadow-[0_8px_20px_rgba(59,130,246,0.25)] border border-white/25">
                    <div className="w-3.5 h-3.5 bg-white/25 rounded-full flex items-center justify-center">
                      <svg
                        className="w-2 h-2 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[8px] font-black uppercase tracking-wide">
                        Upload PDF
                      </span>
                      <span className="text-[6.5px] font-semibold opacity-90 mt-0.5">
                        Get Summary
                      </span>
                    </div>
                  </div>
                </div>

                {/* Green Oval Capsule: Generate Questions */}
                <div
                  className="absolute top-[52%] left-[15%] z-30 animate-float-fast select-none pointer-events-none"
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="flex items-center gap-1.5 rounded-full bg-[#10b981] text-white px-3.5 py-1.5 shadow-[0_8px_20px_rgba(16,185,129,0.25)] border border-white/25">
                    <div className="w-3.5 h-3.5 bg-white/25 rounded-full flex items-center justify-center">
                      <svg
                        className="w-2 h-2 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[8px] font-black uppercase tracking-wide">
                        Generate
                      </span>
                      <span className="text-[6.5px] font-semibold opacity-90 mt-0.5">
                        Questions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Orange Capsule: Smart Suggestions */}
                <div
                  className="absolute bottom-[20%] left-[8%] z-30 animate-float-slow select-none pointer-events-none"
                  style={{ animationDelay: "2.5s" }}
                >
                  <div className="flex items-center gap-1.5 rounded-full bg-[#f97316] text-white px-3.5 py-1.5 shadow-[0_8px_20px_rgba(249,115,22,0.25)] border border-white/25">
                    <div className="w-3.5 h-3.5 bg-white/25 rounded-full flex items-center justify-center">
                      <svg
                        className="w-2 h-2 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                        <line x1="9" y1="18" x2="15" y2="18" />
                        <line x1="10" y1="22" x2="14" y2="22" />
                      </svg>
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[8px] font-black uppercase tracking-wide">
                        Smart
                      </span>
                      <span className="text-[6.5px] font-semibold opacity-90 mt-0.5">
                        Suggestions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <AnimatedSection
        id="features"
        className="py-24 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-900/50 transition-colors duration-300"
      >
        <div className="container px-4 mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl tracking-tight text-slate-900 dark:text-white font-lexend">
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
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors font-lexend">
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

      {/* Built for every role Section */}
      <AnimatedSection
        id="roles"
        className="py-24 bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300"
      >
        <div className="container px-4 mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl tracking-tight text-slate-900 dark:text-white font-lexend">
              Built for every role
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Tailored dashboards for the people who run your institute.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {roles.map((r) => (
              <Link key={r.title} href={r.to} className="group h-full">
                <Card className="relative overflow-hidden h-full bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800/80 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10">
                  <div
                    className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br ${r.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
                  >
                    <r.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors font-lexend">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                    {r.desc}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-bold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform duration-300">
                    <span>Go to Dashboard</span>
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </div>
                </Card>
              </Link>
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
            <h2 className="text-3xl font-extrabold md:text-4xl tracking-tight text-slate-900 dark:text-white font-lexend">
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
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Meet the Team Section */}
      <AnimatedSection className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="container px-4 mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl tracking-tight text-slate-900 dark:text-white font-lexend">
              Meet the Team
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              The dedicated developers behind PyramidEdu.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Arulnathan Sivatheevan", id: "UWU/CST/22/083" },
              { name: "Sathananthan Makinthan", id: "UWU/CST/22/087" },
              { name: "Yoganathan Pukaliny", id: "UWU/CST/22/097" },
              { name: "Kantharuban Kowsika", id: "UWU/CST/22/108" },
            ].map((member) => (
              <Card
                key={member.id}
                className="text-center p-6 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-linear-to-br from-indigo-100 to-purple-200 dark:from-indigo-900 dark:to-purple-950 flex items-center justify-center ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-lexend">
                  {member.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {member.id}
                </p>
              </Card>
            ))}
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
            <h2 className="text-3xl font-extrabold md:text-4xl tracking-tight text-slate-900 dark:text-white font-lexend">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Have a question or feedback? Fill out the form below to contact
              our admin team.
            </p>
          </div>
          <div className="mt-16 max-w-2xl mx-auto">
            <Card className="p-8 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-xl shadow-indigo-500/5 backdrop-blur-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Your Name"
                      suppressHydrationWarning
                      className="peer w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                    />
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 peer-focus:text-violet-500 transition-colors" />
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Your Email"
                      suppressHydrationWarning
                      className="peer w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                    />
                    <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 peer-focus:text-violet-500 transition-colors" />
                  </div>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Subject"
                    suppressHydrationWarning
                    className="peer w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                  />
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 peer-focus:text-violet-500 transition-colors" />
                </div>
                <div className="relative group">
                  <textarea
                    placeholder="Your Message"
                    rows={5}
                    suppressHydrationWarning
                    className="peer w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                  ></textarea>
                  <FileCheck2 className="absolute left-3 top-4 w-4 h-4 text-slate-400 peer-focus:text-violet-500 transition-colors" />
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    suppressHydrationWarning
                    className="rounded-full h-12 px-8 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(79,70,229,0.5)] transition-all duration-300 group"
                  >
                    Send Message
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
