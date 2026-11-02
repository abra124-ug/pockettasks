import { Link } from 'react-router-dom';

function Action({ action, primary }) {
  if (!action) return null;
  const cls = primary ? 'btn-primary' : 'btn-soft';
  return action.to ? (
    <Link to={action.to} className={cls}>
      {action.label}
    </Link>
  ) : (
    <button type="button" onClick={action.onClick} className={cls}>
      {action.label}
    </button>
  );
}

export default function EmptyState({ icon: Icon, title, message, action, secondary }) {
  return (
    <div className="flex animate-fade-up flex-col items-center px-8 py-14 text-center">
      <div className="mb-5 grid h-20 w-20 animate-pop place-items-center rounded-3xl bg-brand-soft text-brand-ink">
        {Icon && <Icon size={36} strokeWidth={1.8} />}
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      {message && <p className="mt-1.5 max-w-xs text-sm text-muted">{message}</p>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Action action={action} primary />
        <Action action={secondary} />
      </div>
    </div>
  );
}
