"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Search, Settings, LogOut, ChevronDown,
  LayoutDashboard, Users, GraduationCap, UserCog,
  BarChart3, CreditCard, Wallet, Megaphone, FileText,
  CalendarCheck, BookOpenCheck, Upload, QrCode, Bot, Brain, Bell,
  Menu, X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

export type Role = "admin" | "manager" | "teacher";

const NAV: Record<Role, { label: string; to: string; icon: any }[]> = {
  admin: [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Manage Admins", to: "/admin/admins", icon: UserCog },
    { label: "Manage Teachers", to: "/admin/teachers", icon: GraduationCap },
    { label: "Manage Students", to: "/admin/students", icon: Users },
    { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
    { label: "Payments Overview", to: "/admin/payments", icon: CreditCard },
    { label: "Salary Management", to: "/admin/salary", icon: Wallet },
    { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
    { label: "Reports", to: "/admin/reports", icon: FileText },
    { label: "AI Assistant", to: "/admin/ai-chat", icon: Bot },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ],
  manager: [
    { label: "Dashboard", to: "/manager", icon: LayoutDashboard },
    { label: "Students", to: "/manager/students", icon: Users },
    { label: "Attendance", to: "/manager/attendance", icon: CalendarCheck },
    { label: "Marks", to: "/manager/marks", icon: BookOpenCheck },
    { label: "Fees", to: "/manager/fees", icon: CreditCard },
    { label: "Notifications", to: "/manager/notifications", icon: Bell },
    { label: "AI Predictions", to: "/manager/ai-prediction", icon: Brain },
    { label: "AI Assistant", to: "/manager/ai-chat", icon: Bot },
    { label: "Reports", to: "/manager/reports", icon: FileText },
    { label: "Settings", to: "/manager/settings", icon: Settings },
  ],
  teacher: [
    { label: "Dashboard", to: "/teacher", icon: LayoutDashboard },
    { label: "Students", to: "/teacher/students", icon: Users },
    { label: "Attendance", to: "/teacher/qr-attendance", icon: QrCode },
    { label: "Marks", to: "/teacher/marks", icon: BookOpenCheck },
    { label: "Exams", to: "/teacher/exams", icon: FileText },
    { label: "Upload Notes", to: "/teacher/notes", icon: Upload },
    { label: "Quiz", to: "/teacher/quiz", icon: BookOpenCheck },
    { label: "AI Predictions", to: "/teacher/ai-prediction", icon: Brain },
    { label: "AI Assistant", to: "/teacher/ai-chat", icon: Bot },
    { label: "Announcements", to: "/teacher/announcements", icon: Megaphone },
    { label: "Settings", to: "/teacher/settings", icon: Settings },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  teacher: "Teacher",
};

interface DashboardLayoutProps {
  role: Role;
  title?: string;
  children: React.ReactNode;
}

export const DashboardLayout = ({ role, title, children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const displayEmail = user?.email ?? 'user@pyramidedu.com';
  const displayInitials = ROLE_LABEL[role].split(' ').map((s) => s[0]).join('');

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
          {collapsed ? (
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-primary">
              <span className="text-xs font-bold text-primary-foreground">P</span>
            </div>
          ) : (
            <Logo variant="light" />
          )}
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <p className={cn("mb-2 px-2 text-xs font-semibold uppercase text-sidebar-foreground/50", collapsed && "hidden")}>
            {ROLE_LABEL[role]}
          </p>
          <ul className="space-y-1">
            {NAV[role].map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    onClick={() => setSidebarOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-base",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-base"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className={cn("flex flex-1 flex-col transition-all duration-300", collapsed ? "md:ml-16" : "md:ml-64")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
          <button aria-label="Open sidebar" className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
          <button aria-label="Toggle sidebar" className="hidden md:block" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          
          {/* Right side of header */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative hidden flex-1 max-w-md md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search students, classes, reports..." className="pl-9" />
            </div>
            <Button aria-label="View notifications" variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg p-1 transition-base hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                      {displayInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left md:block">
                    <p className="text-xs font-semibold">{ROLE_LABEL[role]}</p>
                    <p className="text-[10px] text-muted-foreground">{displayEmail}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-destructive cursor-pointer"
                  onSelect={() => logout()}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
              <p className="text-sm text-muted-foreground">Welcome back to your PyramidEdu workspace.</p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};
