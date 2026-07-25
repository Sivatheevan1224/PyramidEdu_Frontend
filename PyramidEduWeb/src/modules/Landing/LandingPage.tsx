import { NavbarSection } from "./components/NavbarSection";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { FooterSection } from "./components/FooterSection";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative bg-[url('/bg_light_edu.png')] bg-cover bg-center bg-no-repeat bg-fixed dark:bg-none"
    >
      {/* Light/Dark Overlay for Readability */}
      <div className="fixed inset-0 -z-50 bg-white/90 dark:bg-slate-950/90 pointer-events-none mix-blend-normal"></div>

      <NavbarSection />

      <HeroSection />

      <FeaturesSection />

      <AboutSection />

      <ContactSection />

      <FooterSection />
    </div>
  );
}
