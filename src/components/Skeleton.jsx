import { cn } from '../utils/helpers.js';

export const Skeleton = ({ className }) => <div className={cn('animate-pulse rounded-xl bg-line', className)} />;

export function TaskListSkeleton({ count = 4 }) {
  return (
    <div className="space-y-3 px-4" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card flex items-center gap-3 p-4">
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="px-4">
        <Skeleton className="h-40 rounded-3xl" />
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mb-3 mt-6 h-5 w-24" />
      </div>
      <TaskListSkeleton count={3} />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-5 px-4 pt-2" aria-busy="true">
      <Skeleton className="h-12" />
      <Skeleton className="h-28" />
      <Skeleton className="h-12" />
      <Skeleton className="h-12" />
    </div>
  );
}
