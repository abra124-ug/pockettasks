import { useState } from 'react';
import { CheckCheck, Monitor, Moon, Sun, Trash2, WifiOff } from 'lucide-react';
import Header from '../components/Header.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { clearAll, clearCompleted, useTasks } from '../hooks/useTasks.js';
import { cn, getTheme, setTheme } from '../utils/helpers.js';
import { toast } from '../utils/toast.js';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

function Section({ title, children, delay = 0 }) {
  return (
    <section className="animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted">{title}</h2>
      <div className="card overflow-hidden">{children}</div>
    </section>
  );
}

function ActionRow({ icon: Icon, label, hint, onClick, disabled, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-line/60 disabled:opacity-50"
    >
      <span className={cn('grid h-10 w-10 place-items-center rounded-xl', danger ? 'bg-accent-soft text-accent-ink' : 'bg-brand-soft text-brand-ink')}>
        <Icon size={19} />
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-semibold">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
    </button>
  );
}

export default function Settings() {
  const { stats } = useTasks();
  const [theme, setThemeState] = useState(getTheme());
  const [confirm, setConfirm] = useState(null);

  const pick = (id) => {
    setThemeState(id);
    setTheme(id);
  };

  const onConfirm = async () => {
    const kind = confirm;
    setConfirm(null);
    if (kind === 'completed') {
      const n = await clearCompleted();
      toast.success(`Removed ${n} completed task${n === 1 ? '' : 's'}`);
    } else {
      await clearAll();
      toast.success('All tasks deleted');
    }
  };

  return (
    <>
      <Header title="Settings" />
      <div className="space-y-6 px-4 pb-4">
        <Section title="Appearance">
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-1.5 p-2">
            {THEMES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={theme === id}
                onClick={() => pick(id)}
                className={cn(
                  'flex h-16 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95',
                  theme === id ? 'bg-brand text-white' : 'text-muted'
                )}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Data" delay={60}>
          <ActionRow
            icon={CheckCheck}
            label="Clear completed tasks"
            hint={`${stats.done} completed`}
            disabled={stats.done === 0}
            onClick={() => setConfirm('completed')}
          />
          <div className="mx-4 h-px bg-line/70" />
          <ActionRow
            icon={Trash2}
            danger
            label="Delete all tasks"
            hint={`${stats.total} on this device`}
            disabled={stats.total === 0}
            onClick={() => setConfirm('all')}
          />
        </Section>

        <Section title="About" delay={120}>
          <div className="flex items-center gap-3 p-4">
            <img src="/icons/icon.svg" alt="" className="h-12 w-12 rounded-2xl" />
            <div>
              <p className="font-bold">PocketTasks</p>
              <p className="text-xs text-muted">Version 1.0.0 · com.pockettasks.app</p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-line/70 p-4 text-sm text-muted">
            <WifiOff size={18} className="mt-0.5 shrink-0 text-brand-ink" />
            <p>Works fully offline. Your tasks are stored only on this device.</p>
          </div>
        </Section>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm === 'completed' ? 'Clear completed tasks?' : 'Delete all tasks?'}
        message={confirm === 'completed' ? 'Completed tasks will be permanently removed.' : 'Every task on this device will be permanently removed.'}
        confirmLabel={confirm === 'completed' ? 'Clear' : 'Delete all'}
        onConfirm={onConfirm}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
