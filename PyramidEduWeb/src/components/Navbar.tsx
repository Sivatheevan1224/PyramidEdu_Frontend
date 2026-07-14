"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      return next;
    });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className="text-sm font-medium text-muted-foreground transition-base hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            suppressHydrationWarning
            className="rounded-full border border-border/60 p-2 text-muted-foreground transition-base hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <Button asChild variant="hero">
            <Link href="/register">Student Sign Up</Link>
          </Button>
        </div>
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          suppressHydrationWarning
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div
        className={cn(
          "md:hidden border-t border-border bg-background",
          open ? "block" : "hidden",
        )}
      >
        <div className="container flex flex-col gap-3 py-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            suppressHydrationWarning
            className="flex items-center justify-center gap-2 rounded-full border border-border/60 px-3 py-2 text-sm font-medium text-muted-foreground transition-base hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className="text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}

          <Button asChild variant="hero" className="mt-2">
            <Link href="/register" onClick={() => setOpen(false)}>
              Student Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
