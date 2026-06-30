import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Brain,
  FileText,
  BarChart3,
  GraduationCap,
  Sparkles,
  ArrowRight,
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

export function HeroSection() {
  return (
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
                <Link href="/register">
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
  );
}
