import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { PRIORITIES, addDays, cn, validateTask } from '../utils/helpers.js';
import { toast } from '../utils/toast.js';

const SELECTED = {
  high: 'bg-accent text-white',
  medium: 'bg-brand text-white',
  low: 'bg-ink text-bg',
};

export default function TaskForm({ initial, submitLabel = 'Save task', onSubmit }) {
  const [values, setValues] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    priority: initial?.priority ?? 'medium',
    dueDate: initial?.dueDate ?? '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [shake, setShake] = useState(0);

  const set = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateTask(values);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake((n) => n + 1);
      navigator.vibrate?.(20);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="animate-fade-up">
      <div className="space-y-6 px-4 pt-2">
        <div key={shake} className={cn(shake > 0 && errors.title && 'animate-shake')}>
          <label htmlFor="title" className="mb-1.5 block text-[13px] font-semibold text-muted">
            Title
          </label>
          <input
            id="title"
            className={cn('field', errors.title && 'border-accent focus:border-accent focus:ring-accent/15')}
            placeholder="What needs to get done?"
            value={values.title}
            maxLength={80}
            autoFocus={!initial}
            autoComplete="off"
            onChange={(e) => set('title', e.target.value)}
          />
          <div className="mt-1.5 flex justify-between text-xs">
            <span className="font-medium text-accent-ink">{errors.title}</span>
            <span className="text-muted">{values.title.length}/80</span>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-[13px] font-semibold text-muted">
            Description <span className="font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            rows={4}
            className="field resize-none"
            placeholder="Add a few details"
            value={values.description}
            maxLength={500}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        <div>
          <span className="mb-1.5 block text-[13px] font-semibold text-muted">Priority</span>
          <div role="radiogroup" aria-label="Priority" className="grid grid-cols-3 gap-1.5 rounded-2xl bg-line/60 p-1.5">
            {Object.entries(PRIORITIES).map(([key, p]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={values.priority === key}
                onClick={() => set('priority', key)}
                className={cn(
                  'h-11 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95',
                  values.priority === key ? `${SELECTED[key]} shadow-card` : 'text-muted'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="due" className="mb-1.5 block text-[13px] font-semibold text-muted">
            Due date <span className="font-normal">(optional)</span>
          </label>
          <input id="due" type="date" className="field" value={values.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              ['Today', 0],
              ['Tomorrow', 1],
              ['Next week', 7],
            ].map(([label, n]) => (
              <button
                key={label}
                type="button"
                onClick={() => set('dueDate', addDays(n))}
                className={cn(
                  'chip h-8 px-3 transition active:scale-95',
                  values.dueDate === addDays(n) ? 'bg-brand text-white' : 'bg-brand-soft text-brand-ink'
                )}
              >
                {label}
              </button>
            ))}
            {values.dueDate && (
              <button type="button" onClick={() => set('dueDate', '')} className="chip h-8 bg-line/70 px-3 text-muted active:scale-95">
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-6 bg-bg/90 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? <Loader2 size={20} className="animate-spin" /> : submitLabel}
        </button>
      </div>
    </form>
  );
}
