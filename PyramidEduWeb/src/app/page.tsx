import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bot, QrCode, BarChart3, FileCheck2, Wallet,
  Shield, Users, GraduationCap, Sparkles, ArrowRight,
} from "lucide-react";

const features = [
  { icon: Bot, title: "AI Chatbot Assistance", desc: "24/7 intelligent assistant for students, staff and parents." },
  { icon: QrCode, title: "QR Code Attendance", desc: "Scan-and-go attendance with live class roll and reports." },
  { icon: BarChart3, title: "Performance Insights", desc: "ML-powered predictions to spot at-risk students early." },
  { icon: FileCheck2, title: "Online Exams & Quizzes", desc: "Create, schedule, auto-grade and analyze exams." },
  { icon: Wallet, title: "Fee & Salary Management", desc: "Automated invoices, payroll and reconciliations." },
  { icon: Shield, title: "Role-based Security", desc: "Granular access for admins, teachers and students." },
];

const roles = [
  { icon: Shield, title: "Admin Control Panel", desc: "Govern the entire institute, payments and analytics.", to: "/admin", accent: "from-primary to-secondary" },
  { icon: Users, title: "Manager Operations System", desc: "Run day-to-day operations across departments.", to: "/manager", accent: "from-secondary to-accent" },
  { icon: GraduationCap, title: "Teacher Academic Dashboard", desc: "Track classes, attendance and student performance.", to: "/teacher", accent: "from-accent to-primary" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-hero">
        <div className="container grid gap-12 py-16 md:grid-cols-2 md:py-24 lg:gap-16 items-center">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> AI-powered institute platform
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Smart Institute Management <span className="text-gradient">Starts Here</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Manage students, staff, and academic performance with AI-powered insights — all in one beautifully simple platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link href="/login">Get Started <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/login">Login</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
              <div><span className="text-2xl font-bold text-foreground">12k+</span><br />Students</div>
              <div><span className="text-2xl font-bold text-foreground">500+</span><br />Institutes</div>
              <div><span className="text-2xl font-bold text-foreground">98%</span><br />Satisfaction</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-primary opacity-20 blur-3xl" />
            <Image
              src="/hero-education.jpg"
              alt="PyramidEdu dashboard"
              width={1536}
              height={1024}
              className="rounded-2xl border border-border shadow-elegant"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Everything your institute needs</h2>
          <p className="mt-3 text-muted-foreground">A complete toolkit, designed for clarity and built for scale.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group flex h-full flex-col p-6 transition-base hover:-translate-y-1 hover:shadow-elegant">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-base group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-muted/40 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Built for every role</h2>
            <p className="mt-3 text-muted-foreground">Tailored dashboards for the people who run your institute.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {roles.map((r) => (
              <Link key={r.title} href={r.to} className="group">
                <Card className="h-full overflow-hidden p-6 transition-base hover:-translate-y-1 hover:shadow-elegant">
                  <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${r.accent} text-primary-foreground shadow-elegant`}>
                    <r.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Open dashboard <ArrowRight className="h-4 w-4 transition-base group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Why PyramidEdu</h2>
          <p className="mt-4 text-muted-foreground">
            We combine modern operations tooling with predictive AI so educators can focus on what matters most:
            their students. From attendance to performance forecasting, PyramidEdu unifies it all in one calm, beautiful interface.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center shadow-elegant md:p-16">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">Transform your institute with PyramidEdu</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">Get started in minutes. No credit card required.</p>
          <Button asChild size="xl" className="mt-7 bg-background text-foreground hover:bg-background/90">
            <Link href="/login">Get Started <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
