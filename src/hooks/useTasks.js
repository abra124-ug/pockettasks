import { useMemo, useSyncExternalStore } from 'react';
import { loadTasks, saveTasks, clearTasks } from '../services/taskStorage.js';
import { toast } from '../utils/toast.js';
import { uid, toDateStr } from '../utils/helpers.js';

/* Tiny external store so every screen shares one task list. */
let state = { tasks: [], status: 'loading', error: null };
let started = false;
const listeners = new Set();

const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

async function persist(tasks) {
  try {
    await saveTasks(tasks);
  } catch (e) {
    console.error(e);
    toast.error("Couldn't save to this device");
  }
}
const commit = (tasks) => {
  set({ tasks });
  return persist(tasks);
};

export async function initTasks(force = false) {
  if (started && !force) return;
  started = true;
  set({ status: 'loading', error: null });
  try {
    const [tasks] = await Promise.all([loadTasks(), new Promise((r) => setTimeout(r, 350))]);
    set({ tasks, status: 'ready' });
  } catch (e) {
    console.error(e);
    set({ status: 'error', error: "We couldn't read your saved tasks." });
  }
}

export async function addTask({ title, description, priority, dueDate }) {
  const now = new Date().toISOString();
  const task = {
    id: uid(),
    title: title.trim(),
    description: (description || '').trim(),
    priority: priority || 'medium',
    dueDate: dueDate || null,
    completed: false,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
  await commit([task, ...state.tasks]);
  return task;
}

export async function updateTask(id, { title, description, priority, dueDate }) {
  const now = new Date().toISOString();
  await commit(
    state.tasks.map((t) =>
      t.id === id
        ? { ...t, title: title.trim(), description: (description || '').trim(), priority, dueDate: dueDate || null, updatedAt: now }
        : t
    )
  );
}

export async function toggleTask(id) {
  const now = new Date().toISOString();
  await commit(
    state.tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed, completedAt: t.completed ? null : now, updatedAt: now } : t
    )
  );
}

export async function removeTask(id) {
  const removed = state.tasks.find((t) => t.id === id);
  await commit(state.tasks.filter((t) => t.id !== id));
  return removed;
}

export async function restoreTask(task) {
  await commit([task, ...state.tasks.filter((t) => t.id !== task.id)]);
}

export async function clearCompleted() {
  const count = state.tasks.filter((t) => t.completed).length;
  await commit(state.tasks.filter((t) => !t.completed));
  return count;
}

export async function clearAll() {
  set({ tasks: [], status: 'ready', error: null });
  try {
    await clearTasks();
  } catch (e) {
    console.error(e);
    toast.error("Couldn't clear saved data");
  }
}

/* Actions with feedback, shared by Home, Tasks and Details. */
export async function toggleWithToast(task) {
  navigator.vibrate?.(8);
  const wasDone = task.completed;
  await toggleTask(task.id);
  toast.success(wasDone ? 'Task reopened' : 'Task completed', {
    action: { label: 'Undo', onClick: () => toggleTask(task.id) },
  });
}

export async function deleteWithToast(task) {
  await removeTask(task.id);
  toast.success('Task deleted', { action: { label: 'Undo', onClick: () => restoreTask(task) } });
}

export function useTasks() {
  const snap = useSyncExternalStore(subscribe, () => state);
  const stats = useMemo(() => {
    const total = snap.tasks.length;
    const done = snap.tasks.filter((t) => t.completed).length;
    const overdue = snap.tasks.filter(
      (t) => !t.completed && t.dueDate && t.dueDate < toDateStr(new Date())
    ).length;
    return { total, done, pending: total - done, overdue, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [snap.tasks]);
  return { ...snap, stats };
}
