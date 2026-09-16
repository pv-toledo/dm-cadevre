import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(birthDate: Date) {
  const today = new Date()
  const diff = today.getTime() - birthDate.getTime()
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function getInitials(fullName: string): string {
  const names = fullName.trim().split(/\s+/)

  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
}

export function emptyToNull(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}