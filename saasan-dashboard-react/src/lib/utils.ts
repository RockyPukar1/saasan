import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely formats a date string or Date object with a fallback
 * @param date - The date to format (string, Date, or null/undefined)
 * @param formatString - The date-fns format string
 * @param fallback - The fallback text to show if date is invalid (default: "N/A")
 * @returns Formatted date string or fallback
 */
export function safeFormatDate(
  date: string | Date | null | undefined,
  formatString: string,
  fallback: string = "N/A"
): string {
  if (!date) return fallback;

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return fallback;
  }

  try {
    return format(dateObj, formatString);
  } catch (error) {
    console.warn("Date formatting error:", error);
    return fallback;
  }
}
