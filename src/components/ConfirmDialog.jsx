export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = true, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Cancel" onClick={onCancel} className="absolute inset-0 animate-fade-in bg-black/50" />
      <div className="relative w-full max-w-md animate-sheet-up rounded-t-3xl bg-surface p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-nav">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1.5 text-sm text-muted">{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onCancel} className="btn bg-line/70 text-ink">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary'}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
