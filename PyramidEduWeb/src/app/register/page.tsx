"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Lock, User, Eye, EyeOff, Phone, GraduationCap, Calendar, Users, MapPin, IdCard } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select a gender"),
  email: z.string().trim().email("Invalid student email").max(255),
  phone: z.string().trim().min(7, "Invalid phone number").max(20),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  rollNumber: z.string().trim().min(1, "Roll number is required").max(40),
  className: z.string().trim().min(1, "Class / Grade is required").max(40),
  section: z.string().trim().max(20).optional().or(z.literal("")),
  academicYear: z.string().trim().min(1, "Academic year is required").max(20),
  address: z.string().trim().min(5, "Address is required").max(300),
  guardianName: z.string().trim().min(2, "Guardian name is required").max(80),
  guardianRelation: z.string().min(1, "Select relation"),
  guardianEmail: z.string().trim().email("Invalid guardian / parent email").max(255),
  guardianPhone: z.string().trim().min(7, "Invalid guardian phone").max(20),
});

const Register = () => {
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(fd), gender, guardianRelation: relation };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    toast.success("Student account created — verify your email to continue");
    router.push("/verify");
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-hero p-4 py-10">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />

      <div className="relative w-full max-w-2xl">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="glass rounded-2xl p-8 shadow-elegant">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold">Student Sign Up</h1>
              <p className="text-sm text-muted-foreground">
                Only students register here. Admins, Managers and Teachers are added by the institute.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            {/* Personal */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">Personal details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="fullName" label="Full name" icon={User} placeholder="Jane Doe" required />
                <Field id="dateOfBirth" label="Date of birth" icon={Calendar} type="date" required />
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Field id="phone" label="Phone" icon={Phone} type="tel" placeholder="+91 90000 00000" required />
              </div>
            </section>

            {/* Account */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">Login credentials</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="email" label="Student email" icon={Mail} type="email" placeholder="student@school.edu" required />
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="password" name="password" type={show ? "text" : "password"} required
                      className="pl-9 pr-9" placeholder="At least 8 characters" />
                    <button type="button" aria-label="Toggle password" onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Academic */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">Academic information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="rollNumber" label="Roll number / ID" icon={IdCard} placeholder="STD-2026-014" required />
                <Field id="className" label="Class / Grade" icon={GraduationCap} placeholder="Grade 10" required />
                <Field id="section" label="Section" placeholder="A" />
                <Field id="academicYear" label="Academic year" placeholder="2025 - 2026" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea id="address" name="address" required className="pl-9 min-h-[80px]"
                    placeholder="House / street, city, postal code" />
                </div>
              </div>
            </section>

            {/* Guardian */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">Parent / Guardian</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="guardianName" label="Guardian full name" icon={Users} placeholder="John Doe" required />
                <div className="space-y-2">
                  <Label>Relation</Label>
                  <Select value={relation} onValueChange={setRelation}>
                    <SelectTrigger><SelectValue placeholder="Select relation" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Legal Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Field id="guardianEmail" label="Parent / Guardian email" icon={Mail} type="email"
                  placeholder="parent@email.com" required />
                <Field id="guardianPhone" label="Parent / Guardian phone" icon={Phone} type="tel"
                  placeholder="+91 90000 00000" required />
              </div>
            </section>

            <Button type="submit" variant="hero" size="lg" className="w-full">Create student account</Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Staff member? <Link href="/login" className="font-semibold text-primary hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

type FieldProps = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

const Field = ({ id, label, icon: Icon, type = "text", placeholder, required }: FieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
      <Input id={id} name={id} type={type} placeholder={placeholder} required={required}
        className={Icon ? "pl-9" : ""} />
    </div>
  </div>
);

export default Register;
