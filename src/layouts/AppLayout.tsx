import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useLogout } from '@/hooks/useAuth';
import { NotificationBell } from '@/features/notifications/NotificationBell';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M4 5h16M4 12h16M4 19h9' },
  { to: '/board', label: 'Board', icon: 'M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v7h-4z' },
  { to: '/analytics', label: 'Analytics', icon: 'M4 20V10M11 20V4M18 20v-7' },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5" aria-label="Primary">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `focus-ring rail flex items-center gap-3 py-2 pl-3 pr-3 font-mono text-[13px] font-medium uppercase tracking-wide transition-colors ${
              isActive
                ? 'border-accent-400 bg-accent-400/10 text-ink-950 dark:text-paper-100'
                : 'border-transparent text-ink-600 hover:bg-ink-950/5 hover:text-ink-950 dark:text-paper-100/50 dark:hover:bg-paper-100/5 dark:hover:text-paper-100'
            }`
          }
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d={item.icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const logout = useLogout();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink-950">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-ink-950/8 bg-white p-4 dark:border-paper-100/8 dark:bg-ink-900 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-950 font-mono text-[13px] font-bold text-accent-400 dark:bg-accent-400 dark:text-ink-950">
            SD
          </div>
          <span className="font-display font-semibold text-ink-950 dark:text-paper-100">SprintDesk</span>
        </div>
        <NavLinks />
        <div className="mt-auto space-y-2 border-t border-ink-950/8 pt-4 dark:border-paper-100/8">
          <div className="flex items-center gap-2 px-2">
            <Avatar name={user ? `${user.firstName} ${user.lastName}` : 'User'} src={user?.image} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-950 dark:text-paper-100">
                {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
              </p>
              <p className="truncate font-mono text-xs text-ink-600 dark:text-paper-100/40">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-950/5 dark:text-paper-100/60 dark:hover:bg-paper-100/5"
          >
            Log out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-950/8 bg-white/90 px-4 py-3 backdrop-blur dark:border-paper-100/8 dark:bg-ink-900/90 md:pl-64">
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileNavOpen}
          className="focus-ring rounded-lg p-2 text-ink-700 hover:bg-ink-950/5 dark:text-paper-200 dark:hover:bg-paper-100/5 md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center gap-1.5 font-mono text-[13px] font-semibold uppercase tracking-wide text-ink-950 dark:text-paper-100 md:hidden">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-ink-950 text-[11px] text-accent-400 dark:bg-accent-400 dark:text-ink-950">
            SD
          </span>
          SprintDesk
        </div>
        <div className="hidden md:block" />
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="focus-ring rounded-lg p-2 text-ink-600 hover:bg-ink-950/5 hover:text-ink-950 dark:text-paper-100/60 dark:hover:bg-paper-100/5 dark:hover:text-paper-100"
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <NotificationBell />
        </div>
      </header>

      {mobileNavOpen && (
        <div className="border-b border-ink-950/8 bg-white p-4 dark:border-paper-100/8 dark:bg-ink-900 md:hidden">
          <NavLinks onNavigate={() => setMobileNavOpen(false)} />
          <button
            onClick={logout}
            className="focus-ring mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-950/5 dark:text-paper-100/60 dark:hover:bg-paper-100/5"
          >
            Log out
          </button>
        </div>
      )}

      <main className="p-4 md:ml-60 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
