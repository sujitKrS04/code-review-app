import { clsx, type ClassValue } from './clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'error':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'info':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
