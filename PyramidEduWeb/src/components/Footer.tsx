import { Logo } from "./Logo";

export const Footer = () => (
  <footer id="contact" className="border-t border-border bg-card">
    <div className="container grid gap-10 py-14 md:grid-cols-4">
      <div className="space-y-4">
        <Logo />
        <p className="text-sm text-muted-foreground">Smart institute management with AI-powered student performance insights.</p>
      </div>
      <div>
        <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#features" className="hover:text-foreground">Features</a></li>
          <li><a href="#roles" className="hover:text-foreground">Roles</a></li>
          <li><a href="/login" className="hover:text-foreground">Login</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-4 text-sm font-semibold">Contact</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>hello@pyramidedu.com</li>
          <li>+1 (555) 123-4567</li>
        </ul>
      </div>
      <div>
        <h4 className="mb-4 text-sm font-semibold">Follow</h4>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary">Twitter / X</a>
          <a href="#" className="hover:text-primary">Facebook</a>
          <a href="#" className="hover:text-primary">LinkedIn</a>
          <a href="#" className="hover:text-primary">Instagram</a>
        </div>
      </div>
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} PyramidEdu. All rights reserved.
    </div>
  </footer>
);
