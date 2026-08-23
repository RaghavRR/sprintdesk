import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationStore } from '@/stores/notificationStore';
import { NotificationPanel } from '@/features/notifications/NotificationPanel';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const setPanelOpen = useNotificationStore((s) => s.setPanelOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPanelOpen(open);
  }, [open, setPanelOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        className="focus-ring relative rounded-lg p-2 text-ink-600/70 hover:bg-ink-950/6 hover:text-ink-700 dark:text-paper-100/45 dark:hover:bg-paper-100/8 dark:hover:text-paper-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3a6 6 0 00-6 6v3.5L4 16h16l-2-3.5V9a6 6 0 00-6-6z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9.5 19a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  );
}
