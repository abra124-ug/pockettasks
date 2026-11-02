import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, Inbox, Search, SearchX, X, AlertCircle } from 'lucide-react';
import Header from '../components/Header.jsx';
import TaskCard from '../components/TaskCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { TaskListSkeleton } from '../components/Skeleton.jsx';
import { initTasks, toggleWithToast, useTasks } from '../hooks/useTasks.js';
import { cn, sortTasks } from '../utils/helpers.js';

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'active', label: 'Active', test: (t) => !t.completed },
  { id: 'completed', label: 'Completed', test: (t) => t.completed },
  { id: 'high', label: 'High priority', test: (t) => t.priority === 'high' },
];

export default function Tasks() {
  const { tasks, status } = useTasks();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');

  const filter = FILTERS.find((f) => f.id === params.get('filter'))?.id ?? 'all';
  const setFilter = (id) => setParams(id === 'all' ? {} : { filter: id }, { replace: true });

  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.id, tasks.filter(f.test).length])), [tasks]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const test = FILTERS.find((f) => f.id === filter).test;
    const list = tasks.filter((t) => test(t) && (!q || `${t.title} ${t.description}`.toLowerCase().includes(q)));
    return sortTasks(list, sort);
  }, [tasks, filter, query, sort]);

  let body;
  if (status === 'loading') body = <TaskListSkeleton count={5} />;
  else if (status === 'error')
    body = (
      <EmptyState
        icon={AlertCircle}
        title="Couldn't load your tasks"
        message="Something went wrong reading your saved data."
        action={{ label: 'Try again', onClick: () => initTasks(true) }}
      />
    );
  else if (tasks.length === 0)
    body = (
      <EmptyState
        icon={Inbox}
        title="No tasks yet"
        message="Tap the + button to add your first task."
        action={{ label: 'Create a task', to: '/new' }}
      />
    );
  else if (visible.length === 0)
    body = (
      <EmptyState
        icon={SearchX}
        title="No matches"
        message={query ? `Nothing found for "${query.trim()}".` : 'No tasks in this view yet.'}
        action={{ label: 'Show all tasks', onClick: () => { setQuery(''); setFilter('all'); } }}
      />
    );
  else
    body = (
      <div className="space-y-3 px-4">
        {visible.map((t, i) => (
          <TaskCard key={t.id} task={t} index={i} onToggle={toggleWithToast} />
        ))}
      </div>
    );

  return (
    <>
      <Header title="Tasks" subtitle={status === 'ready' ? `${tasks.length} in total` : undefined} />

      <div className="space-y-3 pb-4">
        <div className="relative px-4">
          <Search size={18} className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            aria-label="Search tasks"
            placeholder="Search tasks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-6 top-1/2 grid h-9 w-9 -translate-y-1/2 animate-pop place-items-center rounded-full text-muted active:bg-line">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Filter tasks">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-all duration-200 active:scale-95',
                filter === f.id ? 'bg-brand text-white shadow-card' : 'bg-surface text-muted ring-1 ring-line'
              )}
            >
              {f.label}
              <span className={cn('rounded-full px-1.5 text-[11px]', filter === f.id ? 'bg-white/25' : 'bg-line/70')}>{counts[f.id]}</span>
            </button>
          ))}
        </div>

        {status === 'ready' && tasks.length > 0 && (
          <div className="flex items-center justify-between px-5 text-[13px] text-muted">
            <span>
              {visible.length} task{visible.length === 1 ? '' : 's'}
            </span>
            <label className="flex items-center gap-1.5 font-medium">
              <ArrowUpDown size={14} />
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tasks" className="bg-transparent font-semibold text-ink outline-none">
                <option value="newest">Newest</option>
                <option value="due">Due date</option>
                <option value="priority">Priority</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {body}
    </>
  );
}
