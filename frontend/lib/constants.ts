const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_BASE_URL = (configuredApiUrl || 'http://localhost:4000/api/v1').replace(/\/+$/, '');

export const ACCENT_COLORS = [
  { value: 'blue', label: 'Blue', swatch: '#3b82f6' },
  { value: 'amber', label: 'Amber', swatch: '#f59e0b' },
  { value: 'pink', label: 'Pink', swatch: '#ec4899' },
  { value: 'rose', label: 'Rose', swatch: '#e11d48' },
  { value: 'emerald', label: 'Emerald', swatch: '#059669' },
  { value: 'black', label: 'Black', swatch: '#111827' },
] as const;

export const TASK_STATUSES = ['TODO', 'DOING', 'COMPLETED', 'ON_HOLD'] as const;

export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: 'To Do',
  DOING: 'Doing',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
};

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300',
  MEDIUM: 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-300',
  HIGH: 'text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-300',
  URGENT: 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-300',
};
