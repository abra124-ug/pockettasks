import { Link, Outlet, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import BottomNav from '../components/BottomNav.jsx';
import ToastHost from '../components/Toast.jsx';
import { cn } from '../utils/helpers.js';

const TABS = ['/', '/tasks', '/settings'];

export default function MainLayout() {
  const { pathname } = useLocation();
  const isTab = TABS.includes(pathname);
  const showFab = pathname === '/' || pathname === '/tasks';

  return (
    <div className="relative mx-auto min-h-[100dvh] max-w-md bg-bg sm:border-x sm:border-line">
      <main
        key={pathname}
        className={cn(
          isTab ? 'animate-fade-up' : 'animate-slide-in',
          isTab ? 'pb-[calc(96px+env(safe-area-inset-bottom))]' : 'pb-[env(safe-area-inset-bottom)]'
        )}
      >
        <Outlet />
      </main>

      {isTab && <BottomNav />}

      {showFab && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md">
          <Link
            to="/new"
            aria-label="Create task"
            className="pointer-events-auto absolute bottom-[calc(88px+env(safe-area-inset-bottom))] right-4 grid h-14 w-14 animate-pop place-items-center rounded-2xl bg-accent text-white shadow-fab transition-transform duration-200 active:scale-90"
          >
            <Plus size={28} strokeWidth={2.6} />
          </Link>
        </div>
      )}

      <ToastHost />
    </div>
  );
}
