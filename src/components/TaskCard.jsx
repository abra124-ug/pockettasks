import { Link } from 'react-router-dom';
import { Calendar, Check, Flag } from 'lucide-react';
import { PRIORITIES, cn, formatDue } from '../utils/helpers.js';

const DUE_TONES = {
  overdue: 'bg-accent-soft text-accent-ink',
  today: 'bg-brand-soft text-brand-ink',
  normal: 'bg-line/60 text-muted',
  done: 'bg-line/60 text-muted',
};

export function PriorityChip({ priority }) {
  const p = PRIORITIES[priority];
  return (
    <span className={cn('chip', p.chip)}>
      <Flag size={11} strokeWidth={2.5} /> {p.label}
    </span>
  );
}

export function DueChip({ dateStr, completed }) {
  const due = formatDue(dateStr, completed);
  if (!due) return null;
  return (
    <span className={cn('chip', DUE_TONES[due.tone])}>
      <Calendar size={11} strokeWidth={2.5} /> {due.label}
    </span>
  );
}

export default function TaskCard({ task, onToggle, index = 0 }) {
  const done = task.completed;
  return (
    <div
      className="card flex animate-fade-up items-center pr-3 transition-colors"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? `Reopen ${task.title}` : `Complete ${task.title}`}
        onClick={() => onToggle(task)}
        className="grid h-14 w-14 shrink-0 place-items-center active:scale-90"
      >
        <span
          className={cn(
            'grid h-7 w-7 place-items-center rounded-full border-2 transition-colors duration-200',
            done ? 'border-brand bg-brand' : 'border-muted/40'
          )}
        >
          {done && <Check size={16} strokeWidth={3.2} className="animate-pop text-white" />}
        </span>
      </button>
      <Link to={`/task/${task.id}`} className="min-w-0 flex-1 py-3.5 transition-opacity active:opacity-60">
        <p className={cn('truncate text-[15px] font-semibold transition-colors', done && 'text-muted line-through')}>
          {task.title}
        </p>
        {task.description && <p className="mt-0.5 truncate text-[13px] text-muted">{task.description}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <PriorityChip priority={task.priority} />
          <DueChip dateStr={task.dueDate} completed={done} />
        </div>
      </Link>
    </div>
  );
}
