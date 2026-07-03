import { Logo } from "./Logo";
import { INSTITUTE_INFO } from "@/lib/constants";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-start max-w-6xl mx-auto">
          
          {/* Section 1 - System Information */}
          <div className="space-y-4">
            <Logo />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug max-w-sm">
              {INSTITUTE_INFO.shortDescription}
            </p>
          </div>

          {/* Section 2 - Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 max-w-[160px]">
              <li><a href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#features" className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Features</a></li>
              <li><a href="#contact" className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Section 3 - Contact Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>{INSTITUTE_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="break-all">{INSTITUTE_INFO.email}</span>
              </li>
              {INSTITUTE_INFO.fullAddress && (
                <li className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <span className="leading-snug">{INSTITUTE_INFO.fullAddress}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Section 4 - Institute Login */}
          <div className="pt-1">
            <Button asChild variant="hero" size="sm">
              <Link href="/login">Institute Login</Link>
            </Button>
          </div>

        </div>
      </div>
      
      {/* Section 4 - Copyright */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            © {currentYear} {INSTITUTE_INFO.name}.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
