import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Shield } from "lucide-react";
import { ContactUsForm } from "./ContactUsForm";
import { INSTITUTE_INFO } from "@/lib/constants";

export function ContactSection() {
  return (
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
        <div className="mt-16 grid gap-8 lg:grid-cols-2 items-start">
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
                  {INSTITUTE_INFO.director}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Phone
                  </p>
                  <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                    {INSTITUTE_INFO.phone}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Email
                  </p>
                  <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100 break-all">
                    {INSTITUTE_INFO.email}
                  </p>
                </div>
              </div>

              {/* Google Map Section */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="rounded-2xl overflow-hidden bg-slate-50/80 dark:bg-slate-950/40 relative h-64 sm:h-72 w-full border border-slate-100 dark:border-slate-800/50 shadow-inner">
                  <iframe 
                    src={INSTITUTE_INFO.mapUrl || undefined} 
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Location map for ${INSTITUTE_INFO.name}`}
                  />
                </div>
                
                {/* Map Controls & Info */}
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {INSTITUTE_INFO.name}
                  </p>
                  <a 
                    href={INSTITUTE_INFO.streetViewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg transition-colors text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5"
                  >
                    Open in Map
                  </a>
                </div>
              </div>

            </div>
          </Card>

          <Card className="p-8 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-xl shadow-indigo-500/5 backdrop-blur-sm">
            <ContactUsForm />
          </Card>
        </div>
      </div>
    </AnimatedSection>
  );
}
