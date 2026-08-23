import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative flex h-full w-full max-w-md animate-slide-in flex-col border-l border-ink-950/10 bg-white shadow-xl dark:border-paper-100/10 dark:bg-ink-900 sm:max-w-lg"
      >
        <div className="flex items-center justify-between border-b border-ink-950/10 px-5 py-4 dark:border-paper-100/10">
          <h2 id="drawer-title" className="font-display text-lg font-semibold text-ink-950 dark:text-paper-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="focus-ring rounded-md p-1 text-ink-600/60 hover:bg-ink-950/5 hover:text-ink-950 dark:text-paper-100/50 dark:hover:bg-paper-100/10 dark:hover:text-paper-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
