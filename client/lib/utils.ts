import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
