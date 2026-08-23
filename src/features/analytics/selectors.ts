import { format, parseISO } from 'date-fns';
import type { Task, Sprint, TaskStatus, TaskPriority } from '@/types';
import { STATUS_LABELS, TASK_STATUSES } from '@/types';

export interface StatusDistributionDatum {
  status: string;
  count: number;
}

export function getStatusDistribution(tasks: Task[]): StatusDistributionDatum[] {
  return TASK_STATUSES.map((status) => ({
    status: STATUS_LABELS[status],
    count: tasks.filter((t) => t.status === status).length,
  }));
}

export interface VelocityDatum {
  sprint: string;
  completed: number;
}

export function getSprintVelocity(tasks: Task[], sprints: Sprint[]): VelocityDatum[] {
  return [...sprints]
    .sort((a, b) => a.id - b.id)
    .map((sprint) => ({
      sprint: sprint.name,
      completed: tasks.filter((t) => t.sprintId === sprint.id && t.status === 'done').length,
    }));
}

export interface PriorityBreakdownDatum {
  status: string;
  low: number;
  medium: number;
  high: number;
}

export function getPriorityBreakdown(tasks: Task[]): PriorityBreakdownDatum[] {
  return TASK_STATUSES.map((status) => {
    const inColumn = tasks.filter((t) => t.status === status);
    const byPriority = (p: TaskPriority) => inColumn.filter((t) => t.priority === p).length;
    return { status: STATUS_LABELS[status], low: byPriority('low'), medium: byPriority('medium'), high: byPriority('high') };
  });
}

export interface CompletionTrendDatum {
  date: string;
  completed: number;
}

export function getCompletionTrend(tasks: Task[]): CompletionTrendDatum[] {
  const completedTasks = tasks.filter((t) => t.completedAt);
  const byDay = new Map<string, number>();
  for (const t of completedTasks) {
    const day = format(parseISO(t.completedAt as string), 'MMM d');
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  return Array.from(byDay.entries())
    .map(([date, completed]) => ({ date, completed }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));
}

export function getColumnCounts(tasks: Task[]): Record<TaskStatus, number> {
  return {
    backlog: tasks.filter((t) => t.status === 'backlog').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    review: tasks.filter((t) => t.status === 'review').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };
}
