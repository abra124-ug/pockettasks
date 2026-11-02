import { ArrowLeft } from 'lucide-react';
import { useGoBack } from '../utils/helpers.js';

export default function Header({ title, subtitle, back = false, backTo, right }) {
  const goBack = useGoBack(backTo);
  return (
    <header className="sticky top-0 z-30 bg-bg/90 px-4 pb-2 pt-[calc(env(safe-area-inset-top)+10px)] backdrop-blur-md">
      <div className="flex min-h-11 items-center gap-1">
        {back && (
          <button type="button" aria-label="Go back" onClick={goBack} className="icon-btn -ml-2">
            <ArrowLeft size={22} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[22px] font-bold leading-tight tracking-tight">{title}</h1>
          {subtitle && <p className="truncate text-[13px] text-muted">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
