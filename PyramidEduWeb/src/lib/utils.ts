import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function resolveImageUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  return `${backendUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
