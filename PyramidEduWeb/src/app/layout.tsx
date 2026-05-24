import "@/lib/fetch-debugger";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Inter, Lexend } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "PyramidEdu – Smart Institute Management",
  description: "AI-powered institute management platform",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lexend.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
