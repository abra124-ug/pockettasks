import { NavLink } from 'react-router-dom';
import { Home, ListChecks, Settings } from 'lucide-react';
import { cn } from '../utils/helpers.js';

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-md border-t border-line/70 bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-nav backdrop-blur-md">
        <div className="grid grid-cols-3 px-2 pb-2 pt-2">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="group flex flex-col items-center gap-1 py-1 outline-none">
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'grid h-8 w-16 place-items-center rounded-full transition-all duration-300 group-active:scale-90',
                      isActive ? 'bg-brand-soft text-brand-ink' : 'text-muted'
                    )}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </span>
                  <span className={cn('text-[11px] font-semibold transition-colors', isActive ? 'text-brand-ink' : 'text-muted')}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
