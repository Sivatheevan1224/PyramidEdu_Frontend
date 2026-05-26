"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "About", to: "/#about" },
  { label: "Contact", to: "/#contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="text-sm font-medium text-muted-foreground transition-base hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-base">
            Sign In
          </Link>
          <Button asChild variant="hero">
            <Link href="/register">Student Sign Up</Link>
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className={cn("md:hidden border-t border-border bg-background", open ? "block" : "hidden")}>
        <div className="container flex flex-col gap-3 py-4">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="text-sm font-medium" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <Link href="/login" className="text-sm font-semibold text-center py-2 text-muted-foreground hover:text-foreground transition-base" onClick={() => setOpen(false)}>
            Sign In
          </Link>
          <Button asChild variant="hero" className="mt-2">
            <Link href="/register" onClick={() => setOpen(false)}>Student Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
