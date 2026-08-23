import type { TaskPriority } from '@/types';
import { PRIORITY_LABELS } from '@/types';

const priorityDot: Record<TaskPriority, string> = {
  low: 'bg-ink-600/40 dark:bg-paper-100/30',
  medium: 'bg-column-progress',
  high: 'bg-red-500',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-600 dark:text-paper-100/60">
      <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[priority]}`} aria-hidden="true" />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
