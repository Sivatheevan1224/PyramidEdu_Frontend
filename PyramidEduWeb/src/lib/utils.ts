import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function resolveImageUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const origin = new URL(apiUrl).origin;
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
  } catch {
    return `http://localhost:5000${path.startsWith('/') ? path : `/${path}`}`;
  }
}
