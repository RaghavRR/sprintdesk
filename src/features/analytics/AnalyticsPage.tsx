import { useMemo } from 'react';
import { useBoardData } from '@/hooks/useBoardData';
import { useSprints } from '@/hooks/useSprints';
import { useBoardStore } from '@/stores/boardStore';
import { SprintVelocityChart } from '@/features/analytics/components/SprintVelocityChart';
import { TaskStatusChart } from '@/features/analytics/components/TaskStatusChart';
import { PriorityBreakdownChart } from '@/features/analytics/components/PriorityBreakdownChart';
import { CompletionTrendChart } from '@/features/analytics/components/CompletionTrendChart';
import {
  getStatusDistribution,
  getSprintVelocity,
  getPriorityBreakdown,
  getCompletionTrend,
} from '@/features/analytics/selectors';
import { ErrorState } from '@/components/ui/ErrorState';
import { SkeletonCard } from '@/components/ui/Skeleton';

export function AnalyticsPage() {
  const { isLoading, isError, refetch } = useBoardData();
  const { data: sprints = [] } = useSprints();
  const tasks = useBoardStore((s) => s.tasks);

  const statusData = useMemo(() => getStatusDistribution(tasks), [tasks]);
  const velocityData = useMemo(() => getSprintVelocity(tasks, sprints), [tasks, sprints]);
  const priorityData = useMemo(() => getPriorityBreakdown(tasks), [tasks]);
  const trendData = useMemo(() => getCompletionTrend(tasks), [tasks]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-950 dark:text-paper-100">Analytics</h1>
        <p className="font-mono text-xs text-ink-600/60 dark:text-paper-100/40">Live insights derived from the current sprint board.</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {isError && <ErrorState message="Couldn't load analytics data." onRetry={refetch} />}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SprintVelocityChart data={velocityData} />
          <TaskStatusChart data={statusData} />
          <PriorityBreakdownChart data={priorityData} />
          <CompletionTrendChart data={trendData} />
        </div>
      )}
    </div>
  );
}
