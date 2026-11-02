import { Preferences } from '@capacitor/preferences';

const KEY = 'pockettasks.tasks.v1';
const PRIORITIES = ['low', 'medium', 'high'];

function isValid(t) {
  return (
    t &&
    typeof t === 'object' &&
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    PRIORITIES.includes(t.priority) &&
    typeof t.completed === 'boolean'
  );
}

/** Loads tasks. Uses native storage on Android and localStorage in the browser. */
export async function loadTasks() {
  const { value } = await Preferences.get({ key: KEY });
  if (!value) return [];
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error('Stored data is not a task list');
  return parsed.filter(isValid);
}

export async function saveTasks(tasks) {
  await Preferences.set({ key: KEY, value: JSON.stringify(tasks) });
}

export async function clearTasks() {
  await Preferences.remove({ key: KEY });
}
