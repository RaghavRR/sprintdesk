import { format, isBefore, isValid, parseISO } from 'date-fns';

export function formatDate(value: string | null | undefined): string {
  if (!value) return 'No due date';
  const date = parseISO(value);
  if (!isValid(date)) return 'Invalid date';
  return format(date, 'MMM d, yyyy');
}

export function isOverdue(value: string | null | undefined, status?: string): boolean {
  if (!value) return false;
  const date = parseISO(value);
  if (!isValid(date)) return false;
  return isBefore(date, new Date()) && status !== 'done';
}
