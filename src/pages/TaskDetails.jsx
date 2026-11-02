import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CheckCircle2, ListX, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import Header from '../components/Header.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { DueChip, PriorityChip } from '../components/TaskCard.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { deleteWithToast, toggleWithToast, useTasks } from '../hooks/useTasks.js';
import { cn, formatDateLong } from '../utils/helpers.js';

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-semibold">{children}</span>
    </div>
  );
}

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, status } = useTasks();
  const [confirming, setConfirming] = useState(false);
  const task = tasks.find((t) => t.id === id);

  if (status === 'loading') {
    return (
      <>
        <Header title="Task" back />
        <div className="space-y-3 px-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <Header title="Task" back />
        <EmptyState icon={ListX} title="Task not found" message="It may have been deleted." action={{ label: 'View all tasks', to: '/tasks' }} />
      </>
    );
  }

  const done = task.completed;

  const remove = async () => {
    setConfirming(false);
    navigate('/tasks', { replace: true });
    await deleteWithToast(task);
  };

  return (
    <>
      <Header
        title="Task details"
        back
        right={
          <Link to={`/edit/${task.id}`} aria-label="Edit task" className="icon-btn">
            <Pencil size={20} />
          </Link>
        }
      />

      <div className="space-y-3 px-4 pb-28">
        <section className="card animate-fade-up p-5">
          <span className={cn('chip mb-3', done ? 'bg-brand-soft text-brand-ink' : 'bg-line/70 text-muted')}>
            <CheckCircle2 size={12} /> {done ? 'Completed' : 'In progress'}
          </span>
          <h2 className={cn('break-words text-xl font-bold leading-snug', done && 'text-muted line-through')}>{task.title}</h2>
          {task.description ? (
            <p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-muted">{task.description}</p>
          ) : (
            <p className="mt-3 text-sm italic text-muted/70">No description</p>
          )}
        </section>

        <section className="card animate-fade-up divide-y divide-line/70 px-5" style={{ animationDelay: '70ms' }}>
          <Row label="Priority">
            <PriorityChip priority={task.priority} />
          </Row>
          <Row label="Due">{task.dueDate ? <DueChip dateStr={task.dueDate} completed={done} /> : <span className="text-muted">No due date</span>}</Row>
          <Row label="Created">{formatDateLong(task.createdAt)}</Row>
          {done && task.completedAt && <Row label="Completed">{formatDateLong(task.completedAt)}</Row>}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md bg-bg/90 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
        <div className="flex gap-3">
          <button type="button" onClick={() => toggleWithToast(task)} className={cn('flex-1', done ? 'btn-soft' : 'btn-primary')}>
            {done ? <RotateCcw size={19} /> : <CheckCircle2 size={19} />}
            {done ? 'Reopen task' : 'Mark as done'}
          </button>
          <button type="button" aria-label="Delete task" onClick={() => setConfirming(true)} className="btn w-12 bg-accent-soft px-0 text-accent-ink">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete this task?"
        message="You can undo right after deleting."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
