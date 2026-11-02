import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const cn = (...parts) => parts.filter(Boolean).join(' ');

export const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/* ---------- Priorities ---------- */
export const PRIORITIES = {
  high: { label: 'High', rank: 3, chip: 'bg-accent-soft text-accent-ink' },
  medium: { label: 'Medium', rank: 2, chip: 'bg-brand-soft text-brand-ink' },
  low: { label: 'Low', rank: 1, chip: 'bg-line/70 text-muted' },
};

/* ---------- Dates ---------- */
const pad = (n) => String(n).padStart(2, '0');
export const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
const parseDate = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const daysFromToday = (s) => {
  const t = new Date();
  const today = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return Math.round((parseDate(s) - today) / 86400000);
};

/** Returns { label, tone } where tone is overdue | today | normal | done. */
export function formatDue(dateStr, completed) {
  if (!dateStr) return null;
  const d = daysFromToday(dateStr);
  let label;
  if (d === 0) label = 'Today';
  else if (d === 1) label = 'Tomorrow';
  else if (d === -1) label = 'Yesterday';
  else if (d < -1) label = `${-d} days overdue`;
  else if (d < 7) label = parseDate(dateStr).toLocaleDateString(undefined, { weekday: 'long' });
  else label = parseDate(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const tone = completed ? 'done' : d < 0 ? 'overdue' : d === 0 ? 'today' : 'normal';
  return { label, tone };
}

export const formatDateLong = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Still up?';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/* ---------- Tasks ---------- */
export function sortTasks(tasks, mode = 'newest') {
  const cmp = {
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    due: (a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999') || PRIORITIES[b.priority].rank - PRIORITIES[a.priority].rank,
    priority: (a, b) => PRIORITIES[b.priority].rank - PRIORITIES[a.priority].rank || (a.dueDate || '9999').localeCompare(b.dueDate || '9999'),
  }[mode];
  return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed) || cmp(a, b));
}

export function validateTask({ title = '', description = '' }) {
  const errors = {};
  if (!title.trim()) errors.title = 'Give your task a title';
  else if (title.trim().length > 80) errors.title = 'Keep the title under 80 characters';
  if (description.length > 500) errors.description = 'Keep the description under 500 characters';
  return errors;
}

/* ---------- Navigation ---------- */
export function useGoBack(fallback = '/tasks') {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(() => {
    if (location.key === 'default') navigate(fallback, { replace: true });
    else navigate(-1);
  }, [location.key, navigate, fallback]);
}

/* ---------- Theme ---------- */
const THEME_KEY = 'pt-theme';
export const getTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'system';
  } catch {
    return 'system';
  }
};

export function applyTheme(mode = getTheme()) {
  const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#0A1313' : '#F6FAFA');
}

export function setTheme(mode) {
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* storage unavailable: theme just won't persist */
  }
  applyTheme(mode);
}

export function initTheme() {
  applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') applyTheme('system');
  });
}
