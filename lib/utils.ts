import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number, enabled = true) {
  return enabled ? new Promise<void>(resolve => setTimeout(resolve, ms)) : Promise.resolve();
}

const timeFormatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
const dayFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fullFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
  timeZone: 'UTC',
  weekday: 'short',
  year: 'numeric',
});

/** Compact list timestamp: time of day when sent today, otherwise the day. Deterministic in UTC so cached output matches. */
export function formatListDate(date: Date, now: Date) {
  const sameDay = date.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
  return sameDay ? timeFormatter.format(date) : dayFormatter.format(date);
}

export function formatFullDate(date: Date) {
  return fullFormatter.format(date);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
