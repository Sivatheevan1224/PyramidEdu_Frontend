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
import { 
  Mail, Lock, User, Eye, EyeOff, Phone, GraduationCap, Calendar, Users, 
  MapPin, IdCard, CreditCard, Check, ArrowRight, ArrowLeft, CheckCircle2, 
  ShieldCheck, CircleDollarSign, Sparkles, Loader2, BookOpen, Trash2, Building2, Clock 
} from "lucide-react";
import { toast } from "sonner";

// High-quality mock data matching the Sri Lankan AL educational streams
const STREAMS_DATA = [
  {
    id: "physical-science",
    name: "Physical Science (Combined Maths)",
    courses: [
      {
        id: "c-maths",
        name: "Combined Mathematics",
        monthlyFee: 2500,
        description: "Pure Mathematics and Applied Mathematics comprehensive syllabus.",
        teachers: [
          { id: "t-amal", name: "Prof. Amal Perera", qualification: "B.Sc. (Hons), M.Sc. (UoM)" },
          { id: "t-sunil", name: "Dr. Sunil Silva", qualification: "Ph.D. in Applied Mathematics (UoK)" }
        ]
      },
      {
        id: "physics",
        name: "Physics",
        monthlyFee: 2200,
        description: "Mechanics, Waves & Vibrations, Light, Heat, and Modern Physics.",
        teachers: [
          { id: "t-bandara", name: "Dr. K. Bandara", qualification: "Ph.D. in Physics (UWU)" },
          { id: "t-ruwan", name: "Prof. Ruwan Gunawardena", qualification: "M.Sc. (Cambridge)" }
        ]
      },
      {
        id: "chemistry",
        name: "Chemistry",
        monthlyFee: 2200,
        description: "General, Inorganic, Organic, and Physical Chemistry.",
        teachers: [
          { id: "t-sanduni", name: "Mrs. Sanduni Jayasekara", qualification: "B.Sc. Chemistry Sp. (UoP)" },
          { id: "t-desilva", name: "Mr. N. de Silva", qualification: "M.Sc. Analytical Chemistry (UoJ)" }
        ]
      }
    ]
  },
  {
    id: "biological-science",
    name: "Biological Science",
    courses: [
      {
        id: "biology",
        name: "Biology",
        monthlyFee: 2400,
        description: "Plant biology, animal physiology, genetics, and ecology.",
        teachers: [
          { id: "t-priyantha", name: "Dr. Priyantha Alwis", qualification: "M.D., Ph.D. in Zoology (UoP)" },
          { id: "t-nelum", name: "Dr. Nelum Cooray", qualification: "B.Sc. (Hons) Botany (UoC)" }
        ]
      },
      {
        id: "chemistry-bio",
        name: "Chemistry",
        monthlyFee: 2200,
        description: "General, Inorganic, Organic, and Physical Chemistry.",
        teachers: [
          { id: "t-sanduni", name: "Mrs. Sanduni Jayasekara", qualification: "B.Sc. Chemistry Sp. (UoP)" },
          { id: "t-desilva", name: "Mr. N. de Silva", qualification: "M.Sc. Analytical Chemistry (UoJ)" }
        ]
      },
      {
        id: "physics-bio",
        name: "Physics",
        monthlyFee: 2200,
        description: "Mechanics, Waves & Vibrations, Light, Heat, and Modern Physics.",
        teachers: [
          { id: "t-bandara", name: "Dr. K. Bandara", qualification: "Ph.D. in Physics (UWU)" },
          { id: "t-ruwan", name: "Prof. Ruwan Gunawardena", qualification: "M.Sc. (Cambridge)" }
        ]
      }
    ]
  },
  {
    id: "commerce",
    name: "Commerce",
    courses: [
      {
        id: "accounting",
        name: "Accounting",
        monthlyFee: 2000,
        description: "Financial accounting, cost methods, auditing, and tax.",
        teachers: [
          { id: "t-rohan", name: "Mr. Rohan Fernando", qualification: "FCA, MBA (UoJ)" },
          { id: "t-deepani", name: "Mrs. Deepani Perera", qualification: "B.Com. Sp. (SJP)" }
        ]
      },
      {
        id: "business-studies",
        name: "Business Studies",
        monthlyFee: 1800,
        description: "Principles of management, marketing, HR, and operations.",
        teachers: [
          { id: "t-samarakoon", name: "Prof. M. Samarakoon", qualification: "Ph.D. in Management Studies" },
          { id: "t-wickrama", name: "Dr. T. Wickramasinghe", qualification: "MBA (Harvard)" }
        ]
      },
      {
        id: "economics",
        name: "Economics",
        monthlyFee: 1800,
        description: "Microeconomics, Macroeconomics, public finance, and trade.",
        teachers: [
          { id: "t-sajith", name: "Dr. Sajith Ranasinghe", qualification: "Ph.D. in Economics (LSE)" },
          { id: "t-wije", name: "Mr. L. Wijewardena", qualification: "B.Sc. Economics (SJP)" }
        ]
      }
    ]
  },
  {
    id: "technology",
    name: "Technology (A/L Tech)",
    courses: [
      {
        id: "ict",
        name: "Information & Communication Technology (ICT)",
        monthlyFee: 2300,
        description: "Programming (Python), Networking, DB Systems, and Web.",
        teachers: [
          { id: "t-janaka", name: "Mr. Janaka Senanayake", qualification: "M.Sc. in Computer Science (UoM)" },
          { id: "t-kperera", name: "Miss K. Perera", qualification: "B.Sc. in Software Engineering (UWU)" }
        ]
      },
      {
        id: "sft",
        name: "Science for Technology (SFT)",
        monthlyFee: 2000,
        description: "Applied Science, Mathematics, and Technology Fundamentals.",
        teachers: [
          { id: "t-hmranasinghe", name: "Dr. H. M. Ranasinghe", qualification: "Ph.D. in Bio-Tech (UWU)" },
          { id: "t-gamage", name: "Mr. P. Gamage", qualification: "B.Sc. Applied Sciences (UoP)" }
        ]
      },
      {
        id: "et",
        name: "Engineering Technology (ET)",
        monthlyFee: 2200,
        description: "Civil, Mechanical, and Electrical technology foundations.",
        teachers: [
          { id: "t-gamini", name: "Prof. Gamini Alwis", qualification: "M.Tech., Ph.D. Engineering (UoM)" },
          { id: "t-liyanage", name: "Mr. S. K. Liyanage", qualification: "B.Sc. Mechanical Eng. (UoP)" }
        ]
      }
    ]
  }
];

const ADMISSION_FEE = 1500; // Registration / Admission fee in Rs.

export default function RegisterPage() {
  const router = useRouter();
  
  // Step State
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successState, setSuccessState] = useState<{
    status: "online_success" | "physical_pending" | null;
    regNumber: string;
  }>({ status: null, regNumber: "" });

  // Form Fields State
  const [formFields, setFormFields] = useState<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    indexNumber: string;
    parentName: string;
    parentRelation: string;
    parentEmail: string;
    parentPhone: string;
    
    // Step 2: Multi-course & teacher selection state
    selectedStreamId: string;
    selectedCourseIds: string[]; // Supports multiple selections
    selectedTeacherIds: Record<string, string>; // Maps courseId -> teacherId
    
    // Step 3: Payment
    paymentMethod: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
    cardName: string;
    receiptUploaded: boolean;
    receiptFileName: string;
  }>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    indexNumber: "",

    parentName: "",
    parentRelation: "",
    parentEmail: "",
    parentPhone: "",

    selectedStreamId: "",
    selectedCourseIds: [],
    selectedTeacherIds: {},

    paymentMethod: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    receiptUploaded: false,
    receiptFileName: "",
  });

  // Derived Values
  const selectedStream = STREAMS_DATA.find(s => s.id === formFields.selectedStreamId);
  
  // Find all course objects that are selected
  const selectedCourses = selectedStream 
    ? selectedStream.courses.filter(c => formFields.selectedCourseIds.includes(c.id))
    : [];

  // Calculate cumulative course fees
  const coursesTotalFee = selectedCourses.reduce((sum, c) => sum + c.monthlyFee, 0);
  const totalAmount = ADMISSION_FEE + coursesTotalFee;

  // Validation functions
  const validateStep1 = () => {
    const { 
      firstName, lastName, dateOfBirth, gender, phone, address, email, 
      password, indexNumber, parentName, parentRelation, parentEmail, parentPhone 
    } = formFields;

    if (!firstName || !lastName || !dateOfBirth || !gender || !phone || !address || !email || !password || !indexNumber) {
      toast.error("Please fill in all student personal details.");
      return false;
    }
    if (!parentName || !parentRelation || !parentEmail || !parentPhone) {
      toast.error("Please fill in parent / guardian details.");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Invalid student email address.");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formFields.selectedStreamId) {
      toast.error("Please select an academic stream.");
      return false;
    }
    if (formFields.selectedCourseIds.length === 0) {
      toast.error("Please select at least one course/subject.");
      return false;
    }
    
    // Verify each selected course has a teacher assigned
    for (const courseId of formFields.selectedCourseIds) {
      if (!formFields.selectedTeacherIds[courseId]) {
        const course = selectedStream?.courses.find(c => c.id === courseId);
        toast.error(`Please select your preferred teacher for ${course?.name || "all courses"}.`);
        return false;
      }
    }
    return true;
  };

  // Next / Back buttons
  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Payment mock actions
  const handlePayAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formFields.paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    if (formFields.paymentMethod === "online") {
      const { cardNumber, cardExpiry, cardCvv, cardName } = formFields;
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        toast.error("Please fill in credit card details for online payment.");
        return;
      }
    } else {
      // Physical visit confirmation check
      if (!formFields.receiptUploaded) {
        toast.error("Please confirm that you will visit the institute to complete payment.");
        return;
      }
    }

    setIsSubmitting(true);
    
    // Simulate API request to Backend
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsSubmitting(false);

    // Random Registration Number
    const randomRegNum = `PE-${formFields.selectedStreamId.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (formFields.paymentMethod === "online") {
      setSuccessState({
        status: "online_success",
        regNumber: randomRegNum
      });
      toast.success("Online payment successful! Portal account activated.");
    } else {
      setSuccessState({
        status: "physical_pending",
        regNumber: randomRegNum
      });
      toast.success("Registration submitted! Please visit the institute to complete payment.");
    }
  };

  // Reset downstream selections when stream changes
  const handleStreamChange = (streamId: string) => {
    setFormFields(prev => ({
      ...prev,
      selectedStreamId: streamId,
      selectedCourseIds: [],
      selectedTeacherIds: {}
    }));
  };

  // Toggle multi-course selection
  const handleCourseToggle = (courseId: string) => {
    setFormFields(prev => {
      const isCurrentlySelected = prev.selectedCourseIds.includes(courseId);
      let updatedCourseIds;
      let updatedTeacherIds = { ...prev.selectedTeacherIds };

      if (isCurrentlySelected) {
        // Remove course
        updatedCourseIds = prev.selectedCourseIds.filter(id => id !== courseId);
        delete updatedTeacherIds[courseId];
      } else {
        // Add course
        updatedCourseIds = [...prev.selectedCourseIds, courseId];
      }

      return {
        ...prev,
        selectedCourseIds: updatedCourseIds,
        selectedTeacherIds: updatedTeacherIds
      };
    });
  };

  // Card number input masking helper
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    const parts: string[] = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    setFormFields(prev => ({ ...prev, cardNumber: parts.join(" ") }));
  };

  // Card expiry masking helper
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 4);
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }
    setFormFields(prev => ({ ...prev, cardExpiry: value }));
  };

  // Custom File receipt uploader mock
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormFields(prev => ({
        ...prev,
        receiptUploaded: true,
        receiptFileName: file.name
      }));
      toast.success(`Receipt "${file.name}" uploaded successfully!`);
    }
  };

  return (
    <div 
      className="relative grid min-h-screen place-items-center overflow-hidden bg-cover bg-center bg-no-repeat p-4 py-10"
      style={{ backgroundImage: "url('/signin_bg.png')" }}
    >
      {/* Styles Injection for Hardware-Accelerated Breathtaking Animations */}
      <style jsx global>{`
        @keyframes scaleUp {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { transform: translateY(16px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes rotateGlow {
          0% { transform: rotate(0deg); opacity: 0.8; }
          50% { transform: rotate(180deg); opacity: 0.5; }
          100% { transform: rotate(360deg); opacity: 0.8; }
        }
        .animate-scaleUp {
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-rotateGlow {
          animation: rotateGlow 15s linear infinite;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        
        /* Premium Frosty Glass Overrides (Replaces all Ash Slates) */
        .glass-premium {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .dark .glass-premium {
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .glass-subtle {
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.35);
        }
        .dark .glass-subtle {
          background: rgba(15, 23, 42, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
      `}</style>

      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs" />
      
      {/* Dynamic Glow blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl z-0 animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl z-0 animate-pulse" style={{ animationDelay: "3s" }} />

      {/* ================= SUCCESS STATES WITH NEAT POLISHED ANIMATIONS ================= */}
      {successState.status ? (
        <div className="relative w-full max-w-xl z-10 animate-scaleUp">
          <div className="mb-6 flex justify-center"><Logo /></div>
          
          <div className="glass-premium rounded-3xl p-8 shadow-2xl text-center space-y-6 border border-white/40">
            
            {/* Animated Success Checkmark Ring */}
            <div className="relative flex items-center justify-center h-24 w-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-primary/5 dark:bg-primary/10 animate-ping duration-1000" />
              <div className="absolute inset-2 rounded-full bg-primary/10 dark:bg-primary/20 animate-pulse" />
              
              {successState.status === "online_success" ? (
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-100 transition-transform duration-500">
                  <Check className="h-9 w-9 stroke-[3px]" />
                </div>
              ) : (
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-100 transition-transform duration-500">
                  <ShieldCheck className="h-9 w-9 stroke-[2.5px]" />
                </div>
              )}
            </div>

            {/* Headers */}
            <div className="space-y-2 animate-fadeInUp delay-100 opacity-0">
              <h1 className="text-3xl font-black font-sans tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {successState.status === "online_success" 
                  ? "Admission Completed!" 
                  : "Registration Submitted!"}
              </h1>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {successState.status === "online_success"
                  ? "Your transaction was approved instantly. Your student credentials are now active."
                  : "We've received your registration. Please visit PyramidEdu institute to make the payment in person. Your account will be activated once the manager confirms your payment."}
              </p>
            </div>

            {/* Receipt Summary Card (Replacing Ash Card with Premium Frosted Card) */}
            <div className="glass-subtle rounded-2xl p-6 text-left space-y-3.5 animate-fadeInUp delay-200 opacity-0 border shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-white/10 pb-2.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Student ID (Index)</span>
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{successState.regNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Student Name</span>
                <span className="font-extrabold text-foreground">{formFields.firstName} {formFields.lastName}</span>
              </div>
              
              {/* Iterating all selected courses inside the receipt */}
              <div className="space-y-1.5 border-t border-slate-200/50 dark:border-white/10 pt-2.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Enrolled Courses & Instructors</span>
                {selectedCourses.map((c) => {
                  const teacherId = formFields.selectedTeacherIds[c.id];
                  const teacher = c.teachers.find(t => t.id === teacherId);
                  return (
                    <div key={c.id} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground">{c.name}</span>
                      <span className="text-muted-foreground italic">({teacher?.name})</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center border-t border-slate-200/50 dark:border-white/10 pt-2.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Payment Status</span>
                {successState.status === "online_success" ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 ring-1 ring-emerald-500/20">
                    Paid & Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 ring-1 ring-amber-500/20">
                    Pending — Visit Institute to Pay
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center border-t border-slate-200/50 dark:border-white/10 pt-3 text-sm">
                <span className="font-black text-foreground">Total Fee Paid</span>
                <span className="font-black text-primary">Rs. {totalAmount.toLocaleString()}.00</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 animate-fadeInUp delay-300 opacity-0">
              <Button asChild variant="hero" className="w-full h-11 text-xs font-bold shadow-glow">
                <Link href="/login">Sign In to Dashboard</Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setStep(1);
                  setSuccessState({ status: null, regNumber: "" });
                  setFormFields(prev => ({
                    ...prev,
                    firstName: "", lastName: "", email: "", password: "", indexNumber: "",
                    selectedStreamId: "", selectedCourseIds: [], selectedTeacherIds: {}, paymentMethod: ""
                  }));
                }} 
                className="w-full h-11 text-xs font-bold border-slate-200/80 dark:border-white/15 hover:bg-white/10"
              >
                Register Another Student
              </Button>
            </div>
          </div>
        </div>
      ) : (
        
        // ================= WIZARD PORTAL INTERFACE =================
        <div className="relative w-full max-w-3xl z-10 animate-scaleUp">
          <div className="mb-6 flex justify-center"><Logo /></div>

          <div className="glass-premium rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/40 text-foreground">
            
            {/* Title & Step Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="text-2xl font-bold font-sans">Student Admission Portal</h1>
                  <p className="text-xs text-muted-foreground">
                    Enroll in multiple subjects, select preferred teachers, and pay registration fees.
                  </p>
                </div>
              </div>

              {/* Stepper Progress Bar */}
              <div className="relative flex items-start justify-between pt-4 pb-2">
                {/* Background track line — only between first and last circle centers */}
                <div className="absolute top-[calc(1rem+16px)] left-[calc(16.66%)] right-[calc(16.66%)] h-[2px] bg-slate-200/60 dark:bg-white/10 z-0" />
                {/* Active progress line */}
                <div 
                  className="absolute top-[calc(1rem+16px)] left-[calc(16.66%)] h-[2px] bg-primary z-[1] transition-all duration-500 ease-out" 
                  style={{ width: step === 1 ? "0%" : step === 2 ? "calc(50% - 0px)" : "calc(100% - 0px)", maxWidth: "calc(100% - 33.33% + 0px)" }}
                />

                {/* Step 1 */}
                <div className="relative flex flex-col items-center z-10 w-1/3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold border-2 transition-all duration-300 ${
                    step > 1 
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/25" 
                      : step === 1 
                        ? "bg-primary text-white border-primary ring-[3px] ring-primary/20 shadow-lg shadow-primary/30" 
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/15 text-muted-foreground"
                  }`}>
                    {step > 1 ? <Check className="h-4 w-4 stroke-[3px]" /> : "1"}
                  </div>
                  <span className={`mt-2.5 text-[10px] sm:text-[11px] font-bold text-center leading-tight ${
                    step >= 1 ? "text-foreground" : "text-muted-foreground"
                  }`}>Common<br className="sm:hidden" /> Details</span>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col items-center z-10 w-1/3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold border-2 transition-all duration-300 ${
                    step > 2 
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/25" 
                      : step === 2 
                        ? "bg-primary text-white border-primary ring-[3px] ring-primary/20 shadow-lg shadow-primary/30" 
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/15 text-muted-foreground"
                  }`}>
                    {step > 2 ? <Check className="h-4 w-4 stroke-[3px]" /> : "2"}
                  </div>
                  <span className={`mt-2.5 text-[10px] sm:text-[11px] font-bold text-center leading-tight ${
                    step >= 2 ? "text-foreground" : "text-muted-foreground"
                  }`}>Academic<br className="sm:hidden" /> & Courses</span>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col items-center z-10 w-1/3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold border-2 transition-all duration-300 ${
                    step === 3 
                      ? "bg-primary text-white border-primary ring-[3px] ring-primary/20 shadow-lg shadow-primary/30" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/15 text-muted-foreground"
                  }`}>
                    3
                  </div>
                  <span className={`mt-2.5 text-[10px] sm:text-[11px] font-bold text-center leading-tight ${
                    step >= 3 ? "text-foreground" : "text-muted-foreground"
                  }`}>Fee<br className="sm:hidden" /> Payment</span>
                </div>
              </div>
            </div>

            <form onSubmit={handlePayAndRegister} className="mt-4 space-y-6">
              
              {/* ================= STEP 1: PERSONAL & PARENT DETAILS ================= */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeInUp">
                  
                  {/* Section A: Student Personal Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
                      <User className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Student Personal Details</h2>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name <span className="text-red-500">*</span></Label>
                        <Input 
                          id="firstName" 
                          placeholder="Jane" 
                          required 
                          value={formFields.firstName}
                          onChange={e => setFormFields(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name <span className="text-red-500">*</span></Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          required 
                          value={formFields.lastName}
                          onChange={e => setFormFields(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of birth <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            id="dateOfBirth" 
                            type="date" 
                            required 
                            className="pl-9"
                            value={formFields.dateOfBirth}
                            onChange={e => setFormFields(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Gender <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formFields.gender} 
                          onValueChange={val => setFormFields(prev => ({ ...prev, gender: val }))}
                        >
                          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            id="phone" 
                            type="tel" 
                            placeholder="+94 77 123 4567" 
                            required 
                            className="pl-9"
                            value={formFields.phone}
                            onChange={e => setFormFields(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="indexNumber">Student Index / Roll Number <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            id="indexNumber" 
                            placeholder="UWU/CST/22/083" 
                            required 
                            className="pl-9 font-mono uppercase"
                            value={formFields.indexNumber}
                            onChange={e => setFormFields(prev => ({ ...prev, indexNumber: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Residential Address <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea 
                          id="address" 
                          placeholder="House No, Street, City" 
                          required 
                          className="pl-9 min-h-[70px]"
                          value={formFields.address}
                          onChange={e => setFormFields(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section B: Login Credentials */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
                      <Lock className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Portal Login Credentials</h2>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Portal Email <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="student@pyramidedu.com" 
                            required 
                            className="pl-9"
                            value={formFields.email}
                            onChange={e => setFormFields(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="At least 8 characters" 
                            required 
                            className="pl-9 pr-9"
                            value={formFields.password}
                            onChange={e => setFormFields(prev => ({ ...prev, password: e.target.value }))}
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section C: Parent / Guardian details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Parent / Guardian details</h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="parentName">Guardian Full Name <span className="text-red-500">*</span></Label>
                        <Input 
                          id="parentName" 
                          placeholder="John Doe Senior" 
                          required 
                          value={formFields.parentName}
                          onChange={e => setFormFields(prev => ({ ...prev, parentName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relation <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formFields.parentRelation} 
                          onValueChange={val => setFormFields(prev => ({ ...prev, parentRelation: val }))}
                        >
                          <SelectTrigger><SelectValue placeholder="Select relation" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="father">Father</SelectItem>
                            <SelectItem value="mother">Mother</SelectItem>
                            <SelectItem value="guardian">Legal Guardian</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentEmail">Guardian Email <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            id="parentEmail" 
                            type="email" 
                            placeholder="parent@email.com" 
                            required 
                            className="pl-9"
                            value={formFields.parentEmail}
                            onChange={e => setFormFields(prev => ({ ...prev, parentEmail: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentPhone">Guardian Phone <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            id="parentPhone" 
                            type="tel" 
                            placeholder="+94 77 987 6543" 
                            required 
                            className="pl-9"
                            value={formFields.parentPhone}
                            onChange={e => setFormFields(prev => ({ ...prev, parentPhone: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Button */}
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white"
                    >
                      Next: Selection
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                </div>
              )}

              {/* ================= STEP 2: MULTIPLE COURSE SELECTION ================= */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeInUp">
                  <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Select Academic Path</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Select Stream */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Select Academic Stream <span className="text-red-500">*</span></Label>
                      <Select 
                        value={formFields.selectedStreamId} 
                        onValueChange={handleStreamChange}
                      >
                        <SelectTrigger className="h-11 bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-white/10 text-foreground">
                          <SelectValue placeholder="Choose your A/L stream..." />
                        </SelectTrigger>
                        <SelectContent>
                          {STREAMS_DATA.map((stream) => (
                            <SelectItem key={stream.id} value={stream.id}>{stream.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Multiple Courses Selection Grid */}
                    {formFields.selectedStreamId && selectedStream && (
                      <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-semibold text-foreground">
                            Select Subjects to Enroll <span className="text-red-500">*</span>
                          </Label>
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Select 1, 2, or 3 courses
                          </span>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          {selectedStream.courses.map((course) => {
                            const isSelected = formFields.selectedCourseIds.includes(course.id);
                            return (
                              <div 
                                key={course.id}
                                onClick={() => handleCourseToggle(course.id)}
                                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-full ${
                                  isSelected 
                                    ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-glow" 
                                    : "bg-white/50 dark:bg-slate-950/20 border-slate-200/60 dark:border-white/10 hover:border-white/45 hover:bg-white/80 dark:hover:bg-slate-950/40"
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-bold text-foreground">{course.name}</h3>
                                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                                      isSelected 
                                        ? "bg-primary text-white border-primary" 
                                        : "border-slate-300 dark:border-white/20 bg-transparent"
                                    }`}>
                                      {isSelected && <Check className="h-3 w-3 stroke-[2.5px]" />}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    {course.description}
                                  </p>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-200/50 dark:border-white/5">
                                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Class Fee</span>
                                  <span className="text-xs font-black text-primary">Rs. {course.monthlyFee.toLocaleString()}.00/mo</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Teacher Selections for each chosen course */}
                    {selectedCourses.length > 0 && (
                      <div className="space-y-5 pt-4 border-t border-slate-200/50 dark:border-white/10">
                        <Label className="text-sm font-semibold text-foreground block">
                          Select Preferred Teachers for each Subject:
                        </Label>
                        
                        <div className="space-y-4">
                          {selectedCourses.map((course) => {
                            const currentTeacherId = formFields.selectedTeacherIds[course.id] || "";
                            
                            return (
                              <div key={course.id} className="p-4 rounded-2xl glass-subtle border space-y-3">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                                  <span className="text-xs font-bold text-foreground">{course.name} Teacher <span className="text-red-500">*</span></span>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                  {course.teachers.map((teacher) => {
                                    const isTeacherSelected = currentTeacherId === teacher.id;
                                    return (
                                      <div 
                                        key={teacher.id}
                                        onClick={() => setFormFields(prev => ({
                                          ...prev,
                                          selectedTeacherIds: {
                                            ...prev.selectedTeacherIds,
                                            [course.id]: teacher.id
                                          }
                                        }))}
                                        className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                                          isTeacherSelected 
                                            ? "bg-primary/10 border-primary ring-1 ring-primary/20" 
                                            : "bg-white/40 dark:bg-slate-950/20 border-slate-200/60 dark:border-white/5 hover:border-white/20"
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase">
                                            {teacher.name.split(' ').pop()?.[0]}
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-foreground">{teacher.name}</span>
                                            <span className="text-[9px] text-muted-foreground">{teacher.qualification}</span>
                                          </div>
                                        </div>
                                        
                                        {isTeacherSelected && (
                                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                                            <Check className="h-2.5 w-2.5" />
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Fees Breakdown summary - Replaces Ash Card with Premium Frosted Glass */}
                    {selectedCourses.length > 0 && (
                      <div className="glass-subtle border rounded-2xl p-6 mt-6 space-y-4 animate-fadeInUp shadow-sm">
                        <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2.5">
                          <CircleDollarSign className="h-4 w-4 text-primary" />
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Fee Breakdown Summary</h3>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-muted-foreground">
                            <span>One-time Admission / Registration Fee</span>
                            <span className="font-semibold text-foreground">Rs. {ADMISSION_FEE.toLocaleString()}.00</span>
                          </div>
                          
                          {/* Lists each course fee */}
                          {selectedCourses.map((c) => (
                            <div key={c.id} className="flex justify-between text-muted-foreground pl-3 border-l border-primary/20">
                              <span>Monthly Tuition ({c.name})</span>
                              <span className="font-semibold text-foreground">Rs. {c.monthlyFee.toLocaleString()}.00</span>
                            </div>
                          ))}

                          <div className="flex justify-between border-t border-slate-200/50 dark:border-white/10 pt-3 text-sm">
                            <span className="font-extrabold text-foreground">Total Payable Today</span>
                            <span className="font-black text-primary text-base">Rs. {totalAmount.toLocaleString()}.00</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step navigation buttons */}
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handlePrevStep}
                      className="h-11 px-8 rounded-xl font-semibold gap-2 border-slate-200 dark:border-white/10 hover:bg-white/10"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white"
                    >
                      Next: Fee Payment
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                </div>
              )}

              {/* ================= STEP 3: REGISTRATION FEE & METHOD ================= */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeInUp">
                  <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
                    <CircleDollarSign className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Complete Payment & Register</h2>
                  </div>

                  {/* Review summary cards (Replacing Ash slate backgrounds with Glass-subtle) */}
                  <div className="grid gap-4 md:grid-cols-2 glass-subtle border border-slate-200/50 dark:border-white/10 rounded-2xl p-5 text-xs">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Student Summary</p>
                      <p className="font-extrabold text-sm text-foreground">{formFields.firstName} {formFields.lastName}</p>
                      <p className="text-muted-foreground">Index Number: <span className="font-mono text-foreground font-semibold">{formFields.indexNumber}</span></p>
                      <p className="text-muted-foreground">Email: <span className="text-foreground font-semibold">{formFields.email}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Enrollments Summary ({selectedStream?.name})</p>
                      
                      {/* Lists multiple enrolled subjects */}
                      <div className="space-y-1">
                        {selectedCourses.map((c) => {
                          const teacherId = formFields.selectedTeacherIds[c.id];
                          const teacher = c.teachers.find(t => t.id === teacherId);
                          return (
                            <div key={c.id} className="text-muted-foreground">
                              • <span className="text-foreground font-semibold">{c.name}</span> ({teacher?.name})
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-muted-foreground pt-1.5 border-t border-slate-200/50 dark:border-white/5 mt-1.5">
                        Total Amount Due: <span className="text-primary font-black text-sm">Rs. {totalAmount.toLocaleString()}.00</span>
                      </p>
                    </div>
                  </div>

                  {/* Select Payment Method */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold">Choose Registration Fee Payment Method <span className="text-red-500">*</span></Label>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Method 1: Online */}
                      <div 
                        onClick={() => setFormFields(prev => ({ ...prev, paymentMethod: "online" }))}
                        className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                          formFields.paymentMethod === "online" 
                            ? "bg-primary/10 border-primary ring-2 ring-primary/20" 
                            : "bg-white/40 dark:bg-slate-950/20 border-slate-200/60 dark:border-white/10 hover:border-white/20 hover:bg-white/60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="text-sm font-bold">Online Payment</span>
                          </div>
                          {formFields.paymentMethod === "online" && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Pay securely using Credit or Debit card. Registration is instantly approved and account is immediately activated.
                        </p>
                      </div>

                      {/* Method 2: Physical */}
                      <div 
                        onClick={() => setFormFields(prev => ({ ...prev, paymentMethod: "physical" }))}
                        className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                          formFields.paymentMethod === "physical" 
                            ? "bg-primary/10 border-primary ring-2 ring-primary/20" 
                            : "bg-white/40 dark:bg-slate-950/20 border-slate-200/60 dark:border-white/10 hover:border-white/20 hover:bg-white/60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-primary" />
                            <span className="text-sm font-bold">Pay at Institute</span>
                          </div>
                          {formFields.paymentMethod === "physical" && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Visit PyramidEdu institute in person and pay at the front desk. Your account remains "Pending" until the manager confirms your payment.
                        </p>
                      </div>
                    </div>

                    {/* Render Online Payment Form */}
                    {formFields.paymentMethod === "online" && (
                      <div className="glass-subtle border rounded-2xl p-6 mt-4 space-y-4 animate-slideDown shadow-sm">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/50 dark:border-white/10">
                          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Secure Card Gateway</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input 
                              id="cardName" 
                              placeholder="JANE DOE" 
                              required 
                              className="uppercase"
                              value={formFields.cardName}
                              onChange={e => setFormFields(prev => ({ ...prev, cardName: e.target.value.toUpperCase() }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input 
                                id="cardNumber" 
                                placeholder="4111 2222 3333 4444" 
                                required 
                                className="pl-9 font-mono"
                                value={formFields.cardNumber}
                                onChange={handleCardNumberChange}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardExpiry">Expiration Date</Label>
                              <Input 
                                id="cardExpiry" 
                                placeholder="MM/YY" 
                                required 
                                className="font-mono text-center"
                                value={formFields.cardExpiry}
                                onChange={handleExpiryChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardCvv">CVV / CVC</Label>
                              <Input 
                                id="cardCvv" 
                                type="password" 
                                placeholder="•••" 
                                required 
                                maxLength={3}
                                className="font-mono text-center"
                                value={formFields.cardCvv}
                                onChange={e => setFormFields(prev => ({ ...prev, cardCvv: e.target.value.replace(/\D/g, "") }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Render Physical / Visit Institute Form */}
                    {formFields.paymentMethod === "physical" && (
                      <div className="glass-subtle border rounded-2xl p-6 mt-4 space-y-5 animate-slideDown shadow-sm">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/50 dark:border-white/10">
                          <Building2 className="h-4 w-4 text-primary" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Visit Institute to Pay</h3>
                        </div>
                        
                        <div className="space-y-5">
                          {/* Institute visit info card */}
                          <div className="rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/15 p-4 space-y-3">
                            <div className="flex items-start gap-3">
                              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-foreground">PyramidEdu Institute Office</p>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                  Visit our front desk and pay <span className="font-extrabold text-foreground">Rs. {totalAmount.toLocaleString()}.00</span> in cash directly to the institute manager.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-foreground">Office Hours</p>
                                <p className="text-[11px] text-muted-foreground">Monday – Saturday, 8:00 AM – 5:00 PM</p>
                              </div>
                            </div>
                          </div>

                          {/* Steps */}
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">How it works</p>
                            <div className="flex items-start gap-3 text-[11px] text-muted-foreground">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">1</span>
                              <span>Submit this registration form to reserve your enrollment.</span>
                            </div>
                            <div className="flex items-start gap-3 text-[11px] text-muted-foreground">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">2</span>
                              <span>Visit PyramidEdu institute and pay the registration fee at the front desk.</span>
                            </div>
                            <div className="flex items-start gap-3 text-[11px] text-muted-foreground">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">3</span>
                              <span>Once the manager confirms your payment, your student portal account will be activated.</span>
                            </div>
                          </div>

                          {/* Confirmation checkbox */}
                          <div className="flex items-start space-x-3 pt-2 border-t border-slate-200/50 dark:border-white/10">
                            <input 
                              type="checkbox" 
                              id="visitConfirm" 
                              required 
                              checked={formFields.receiptUploaded}
                              onChange={e => setFormFields(prev => ({ 
                                ...prev, 
                                receiptUploaded: e.target.checked,
                                receiptFileName: e.target.checked ? "Will visit institute to pay" : ""
                              }))}
                              className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            />
                            <label htmlFor="visitConfirm" className="text-[11px] text-muted-foreground select-none cursor-pointer leading-relaxed">
                              I understand that my account will remain <strong>pending</strong> until I visit the institute and complete the payment in person.
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Step navigation & Submit button */}
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={isSubmitting}
                      className="h-11 px-8 rounded-xl font-semibold gap-2 border-slate-200 dark:border-white/10 hover:bg-white/10"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white cursor-pointer shadow-glow"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {formFields.paymentMethod === "online" ? "Pay & Register" : "Submit Registration"}
                          <Check className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                </div>
              )}
            </form>

            {/* Sign In Navigation Link */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In to Portal
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
