import type { ReactNode } from 'react';

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-950/10 bg-white p-4 shadow-card dark:border-paper-100/10 dark:bg-ink-900">
      <h3 className="font-display text-sm font-semibold text-ink-950 dark:text-paper-100">{title}</h3>
      {subtitle && <p className="mb-2 font-mono text-[11px] text-ink-600/60 dark:text-paper-100/40">{subtitle}</p>}
      <div className="mt-2 h-64 w-full">{children}</div>
    </div>
  );
}
