import { useSyncExternalStore } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { dismissToast, getToasts, subscribeToasts } from '../utils/toast.js';

const ICONS = {
  success: <CheckCircle2 size={20} className="shrink-0 text-teal-300" />,
  error: <AlertTriangle size={20} className="shrink-0 text-orange-400" />,
  info: <Info size={20} className="shrink-0 text-teal-300" />,
};

export default function ToastHost() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts);
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] mx-auto flex max-w-md flex-col gap-2 px-4 pt-[calc(env(safe-area-inset-top)+12px)]"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex animate-toast-in items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-bg shadow-card"
        >
          {ICONS[t.type]}
          <span className="flex-1">{t.message}</span>
          {t.action && (
            <button
              type="button"
              onClick={() => {
                t.action.onClick();
                dismissToast(t.id);
              }}
              className="-my-2 -mr-2 rounded-xl px-3 py-2 font-bold text-orange-400 active:scale-95"
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
