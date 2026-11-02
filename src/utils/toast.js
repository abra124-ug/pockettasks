let toasts = [];
let nextId = 1;
const listeners = new Set();
const timers = new Map();

const emit = () => listeners.forEach((l) => l());

export const subscribeToasts = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const getToasts = () => toasts;

export function dismissToast(id) {
  clearTimeout(timers.get(id));
  timers.delete(id);
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function show(message, { type = 'info', action, duration } = {}) {
  const id = nextId++;
  toasts = [...toasts, { id, message, type, action }].slice(-3);
  emit();
  timers.set(id, setTimeout(() => dismissToast(id), duration ?? (action ? 5000 : 2800)));
  return id;
}

export const toast = {
  show,
  success: (m, o) => show(m, { ...o, type: 'success' }),
  error: (m, o) => show(m, { ...o, type: 'error', duration: 4500 }),
  info: (m, o) => show(m, { ...o, type: 'info' }),
};
