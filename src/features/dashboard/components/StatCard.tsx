import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'danger' | 'success';
  icon?: ReactNode;
}

const toneClasses = {
  default: 'text-ink-950 dark:text-paper-100',
  danger: 'text-red-600 dark:text-red-400',
  success: 'text-column-done dark:text-green-400',
};

export function StatCard({ label, value, hint, tone = 'default', icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-ink-950/10 bg-white p-4 shadow-card dark:border-paper-100/10 dark:bg-ink-900">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-600/70 dark:text-paper-100/40">{label}</p>
        {icon}
      </div>
      <p className={`mt-1.5 font-display text-3xl font-semibold ${toneClasses[tone]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-600/50 dark:text-paper-100/30">{hint}</p>}
    </div>
  );
}
