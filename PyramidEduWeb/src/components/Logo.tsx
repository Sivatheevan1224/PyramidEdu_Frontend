import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  showText?: boolean;
  textClassName?: string;
  eduClassName?: string;
}

export const Logo = ({
  className,
  variant = "dark",
  showText = true,
  textClassName,
  eduClassName,
}: LogoProps) => (
  <Link href="/" className={cn("inline-flex items-center gap-2 font-bold text-lg", className)}>
    <Image src="/logo.png" alt="PyramidEdu logo" width={36} height={36} className="rounded-full object-cover ring-2 ring-primary/20" />
    {showText && (
      <span className={cn(variant === "light" ? "text-sidebar-foreground" : "text-foreground", textClassName)}>
        Pyramid<span className={cn("text-gradient", eduClassName)}>Edu</span>
      </span>
    )}
  </Link>
);
