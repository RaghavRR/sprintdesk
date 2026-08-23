import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotifications } from '@/hooks/useNotifications';

const typeTone = {
  task: 'blue',
  review: 'amber',
  system: 'purple',
} as const;

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const {
    notifications,
    totalCount,
    unreadCount,
    hasMore,
    isLoading,
    markRead,
    markAllRead,
    loadMore,
  } = useNotifications();

  return (
    <div
      role="region"
      aria-label="Notifications panel"
      className="
        fixed left-1/2 top-16 z-50
        w-[calc(100vw-1.5rem)] max-w-sm
        -translate-x-1/2
        overflow-hidden rounded-xl
        border border-ink-950/10
        bg-white shadow-xl
        dark:border-paper-100/10 dark:bg-ink-900

        sm:absolute sm:left-auto sm:right-0 sm:top-full
        sm:mt-2 sm:w-96 sm:translate-x-0
      "
    >

      <div className="flex items-center justify-between gap-4 border-b border-ink-950/8 px-4 py-3 dark:border-paper-100/10">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-950 dark:text-paper-100">
            Notifications
          </p>

          <p className="text-xs text-ink-600/70 dark:text-paper-100/45">
            {unreadCount} unread of {totalCount}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 whitespace-nowrap"
            onClick={markAllRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto scrollbar-thin">
        {isLoading && (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-ink-950/6 dark:bg-paper-100/8"
              />
            ))}
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="p-4">
            <EmptyState
              title="No notifications yet"
              description="You're all caught up."
            />
          </div>
        )}

        {!isLoading &&
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`focus-ring block w-full border-b border-ink-950/6 px-4 py-3 text-left transition-colors last:border-0 hover:bg-ink-950/[0.03] dark:border-paper-100/10 dark:hover:bg-paper-100/8 ${
                !n.read
                  ? 'bg-accent-50/50 dark:bg-accent-950/20'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 break-words text-sm font-medium text-ink-950 dark:text-paper-100">
                  {n.title}
                </p>

                <Badge tone={typeTone[n.type]}>
                  {n.type}
                </Badge>
              </div>

              <p className="mt-0.5 break-words text-xs text-ink-600/70 dark:text-paper-100/45">
                {n.message}
              </p>

              <p className="mt-1 text-[11px] text-ink-600/40 dark:text-paper-100/40">
                {formatDistanceToNow(new Date(n.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </button>
          ))}
      </div>

      {hasMore && (
        <div className="border-t border-ink-950/8 p-2 dark:border-paper-100/10">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={loadMore}
          >
            Load more
          </Button>
        </div>
      )}

      <div className="border-t border-ink-950/8 p-2 text-center dark:border-paper-100/10">
        <button
          onClick={onClose}
          className="focus-ring text-xs text-ink-600/40 hover:text-ink-600 dark:hover:text-paper-100/70"
        >
          Close
        </button>
      </div>
    </div>
  );
}