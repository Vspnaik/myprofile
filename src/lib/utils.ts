import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGmailUrl(toEmail: string, subject?: string, body?: string) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: toEmail,
  });
  if (subject) params.append("su", subject);
  if (body) params.append("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}
