import type { ReactNode } from 'react';

type Tone = 'gray' | 'blue' | 'amber' | 'red' | 'green' | 'purple';

const toneClasses: Record<Tone, string> = {
  gray: 'bg-ink-950/8 text-ink-700 dark:bg-paper-100/10 dark:text-paper-200',
  blue: 'bg-column-progress/10 text-column-progress dark:bg-column-progress/20 dark:text-blue-300',
  amber: 'bg-accent-100 text-accent-700 dark:bg-accent-400/15 dark:text-accent-300',
  red: 'bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  green: 'bg-column-done/10 text-column-done dark:bg-column-done/20 dark:text-green-300',
  purple: 'bg-column-review/10 text-column-review dark:bg-column-review/20 dark:text-purple-300',
};

export function Badge({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
