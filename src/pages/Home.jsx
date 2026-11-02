import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock, ClipboardList, ListChecks } from 'lucide-react';
import Header from '../components/Header.jsx';
import TaskCard from '../components/TaskCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { HomeSkeleton } from '../components/Skeleton.jsx';
import { initTasks, toggleWithToast, clearAll, useTasks } from '../hooks/useTasks.js';
import { greeting, sortTasks } from '../utils/helpers.js';

function ProgressRing({ pct, size = 96, stroke = 9 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setValue(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xl font-bold text-white">{pct}%</span>
    </div>
  );
}

function Stat({ to, icon: Icon, value, label, tone, delay }) {
  return (
    <Link
      to={to}
      className="card animate-fade-up p-3.5 transition-transform active:scale-95"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}>
        <Icon size={19} />
      </span>
      <p className="mt-3 text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted">{label}</p>
    </Link>
  );
}

export default function Home() {
  const { tasks, status, stats } = useTasks();

  if (status === 'loading') {
    return (
      <>
        <Header title="PocketTasks" subtitle={greeting()} />
        <HomeSkeleton />
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Header title="PocketTasks" />
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load your tasks"
          message="Your saved data couldn't be read. You can try again or reset it."
          action={{ label: 'Try again', onClick: () => initTasks(true) }}
          secondary={{ label: 'Reset data', onClick: clearAll }}
        />
      </>
    );
  }

  const upNext = sortTasks(tasks.filter((t) => !t.completed), 'due').slice(0, 4);

  return (
    <>
      <Header title="PocketTasks" subtitle={greeting()} />
      {stats.total === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Your list is empty"
          message="Add your first task and start getting things done."
          action={{ label: 'Create a task', to: '/new' }}
        />
      ) : (
        <div className="px-4">
          <section className="flex animate-fade-up items-center gap-5 rounded-3xl bg-brand p-5 text-white shadow-card">
            <ProgressRing pct={stats.pct} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/80">Today's progress</p>
              <p className="mt-0.5 text-xl font-bold leading-snug">
                {stats.pending === 0 ? 'All done! 🎉' : `${stats.pending} task${stats.pending === 1 ? '' : 's'} to go`}
              </p>
              {stats.overdue > 0 && (
                <Link to="/tasks?filter=active" className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold">
                  <Clock size={12} /> {stats.overdue} overdue
                </Link>
              )}
            </div>
          </section>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <Stat to="/tasks" icon={ListChecks} value={stats.total} label="Total" tone="bg-brand-soft text-brand-ink" delay={60} />
            <Stat to="/tasks?filter=completed" icon={CheckCircle2} value={stats.done} label="Completed" tone="bg-brand-soft text-brand-ink" delay={120} />
            <Stat to="/tasks?filter=active" icon={Clock} value={stats.pending} label="Pending" tone="bg-accent-soft text-accent-ink" delay={180} />
          </div>

          <div className="mb-3 mt-7 flex items-center justify-between">
            <h2 className="text-base font-bold">Up next</h2>
            <Link to="/tasks" className="text-sm font-semibold text-brand-ink">
              See all
            </Link>
          </div>
          {upNext.length ? (
            <div className="space-y-3">
              {upNext.map((t, i) => (
                <TaskCard key={t.id} task={t} index={i} onToggle={toggleWithToast} />
              ))}
            </div>
          ) : (
            <p className="card p-5 text-center text-sm text-muted">Nothing pending. Enjoy the calm ✨</p>
          )}
        </div>
      )}
    </>
  );
}
