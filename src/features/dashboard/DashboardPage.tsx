import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBoardData } from '@/hooks/useBoardData';
import { useUsers } from '@/hooks/useUsers';
import { useSprints } from '@/hooks/useSprints';
import { useBoardStore } from '@/stores/boardStore';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { PriorityBadge } from '@/features/board/components/PriorityBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { formatDate, isOverdue } from '@/utils/formatDate';
import { STATUS_LABELS, TASK_STATUSES } from '@/types';
import type { Task } from '@/types';

const columnAccent = {
  backlog: 'bg-column-backlog',
  'in-progress': 'bg-column-progress',
  review: 'bg-column-review',
  done: 'bg-column-done',
} as const;

export function DashboardPage() {
  const { isLoading, isError, refetch } = useBoardData();
  const { data: users = [] } = useUsers();
  const { data: sprints = [] } = useSprints();
  const tasks = useBoardStore((s) => s.tasks);

  const usersById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);
  const currentSprint = useMemo(() => [...sprints].sort((a, b) => b.id - a.id)[0], [sprints]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
    const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;
    const highPriority = tasks.filter((t) => t.priority === 'high').length;
    return { total, done, overdue, completionPct, highPriority };
  }, [tasks]);

  const recentActivity = useMemo(
    () => [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6),
    [tasks],
  );

  const overdueTasks = useMemo(() => tasks.filter((t) => isOverdue(t.dueDate, t.status)).slice(0, 5), [tasks]);

  const activityColumns: DataTableColumn<Task>[] = [
    {
      key: 'title',
      header: 'Task',
      render: (t) => <span className="font-medium text-ink-950 dark:text-paper-100">{t.title}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink-600 dark:text-paper-100/60">
          <span className={`h-1.5 w-1.5 rounded-full ${columnAccent[t.status]}`} aria-hidden="true" />
          {STATUS_LABELS[t.status]}
        </span>
      ),
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (t) => {
        const assignee = usersById.get(t.assigneeId ?? -1);
        return (
          <div className="flex items-center gap-2">
            <Avatar name={assignee?.name ?? 'Unassigned'} src={assignee?.avatar} />
            <span className="text-ink-700 dark:text-paper-200">{assignee?.name ?? 'Unassigned'}</span>
          </div>
        );
      },
    },
    {
      key: 'updated',
      header: 'Updated',
      className: 'font-mono text-xs',
      render: (t) => formatDate(t.updatedAt),
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Couldn't load dashboard data." onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-500 dark:text-accent-400">
            {currentSprint ? formatDate(currentSprint.startDate) : ''}
            {currentSprint ? ` – ${formatDate(currentSprint.endDate)}` : ''}
          </p>
          <h1 className="font-display text-xl font-semibold text-ink-950 dark:text-paper-100">
            {currentSprint ? currentSprint.name : 'Dashboard'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/board">
            <Button variant="secondary">View board</Button>
          </Link>
          <Link to="/analytics">
            <Button variant="secondary">View analytics</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} hint="First 30 tasks on the board" />
        <StatCard label="Completion" value={`${stats.completionPct}%`} hint={`${stats.done} of ${stats.total} done`} tone="success" />
        <StatCard label="Overdue" value={stats.overdue} hint="Past due date, not done" tone={stats.overdue > 0 ? 'danger' : 'default'} />
        <StatCard label="High priority" value={stats.highPriority} hint="Across all columns" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-ink-950/10 bg-white p-4 shadow-card dark:border-paper-100/10 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-sm font-semibold text-ink-950 dark:text-paper-100">Column summary</h2>
          <ul className="space-y-2.5">
            {TASK_STATUSES.map((status) => {
              const count = tasks.filter((t) => t.status === status).length;
              return (
                <li key={status} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-ink-600 dark:text-paper-100/70">
                    <span className={`h-1.5 w-1.5 rounded-full ${columnAccent[status]}`} aria-hidden="true" />
                    {STATUS_LABELS[status]}
                  </span>
                  <Badge>{count}</Badge>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-ink-950/10 bg-white p-4 shadow-card dark:border-paper-100/10 dark:bg-ink-900 lg:col-span-2">
          <h2 className="mb-3 font-display text-sm font-semibold text-ink-950 dark:text-paper-100">Overdue tasks</h2>
          {overdueTasks.length === 0 ? (
            <EmptyState title="Nothing overdue" description="Every task is on track." />
          ) : (
            <ul className="space-y-3">
              {overdueTasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink-800 dark:text-paper-200">{t.title}</p>
                    <p className="font-mono text-xs text-red-500">Due {formatDate(t.dueDate).toUpperCase()}</p>
                  </div>
                  <PriorityBadge priority={t.priority} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-sm font-semibold text-ink-950 dark:text-paper-100">Recent activity</h2>
        <DataTable
          columns={activityColumns}
          rows={recentActivity}
          getRowId={(t) => t.id}
          emptyMessage="No recent activity yet."
          caption="Most recently updated tasks"
        />
      </div>
    </div>
  );
}
