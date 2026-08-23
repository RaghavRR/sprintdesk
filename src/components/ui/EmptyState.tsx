import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-950/15 px-6 py-10 text-center dark:border-paper-100/15">
      {icon && <div className="mb-1 text-ink-600/40 dark:text-paper-100/30">{icon}</div>}
      <p className="text-sm font-medium text-ink-700 dark:text-paper-200">{title}</p>
      {description && <p className="max-w-xs text-sm text-ink-600/70 dark:text-paper-100/50">{description}</p>}
      {action}
    </div>
  );
}
