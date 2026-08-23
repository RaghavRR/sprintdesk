export function FullScreenLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper dark:bg-ink-950" role="status" aria-live="polite">
      <svg className="h-8 w-8 animate-spin text-accent-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <p className="font-mono text-sm text-ink-600 dark:text-paper-100/50">{label}</p>
    </div>
  );
}
