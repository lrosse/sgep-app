import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retorna hoje às 00:00:00 (normalizado)
 */
export function getTodayAtMidnight(): Date {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return hoje;
}

/**
 * Retorna hoje às 23:59:59 (final do dia)
 */
export function getTodayAtEndOfDay(): Date {
  const hoje = new Date();
  hoje.setHours(23, 59, 59, 999);
  return hoje;
}

/**
 * Validar se data é no futuro (após hoje)
 */
export function isFutureDate(date: Date): boolean {
  const hoje = getTodayAtMidnight();
  return date > hoje;
}

/**
 * Adicionar dias a uma data (sem mutar original)
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
