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

export function formatPhoneNumber (phoneNumber: string | null) {

  if (!phoneNumber) return ""

  const digits = phoneNumber.replace(/\D/g,"")
  const formattedPhoneNumber = digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15)

  return formattedPhoneNumber
}