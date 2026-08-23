interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-ink-950/8 dark:bg-paper-100/8 ${className}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-xl border border-ink-950/10 bg-white p-4 dark:border-paper-100/10 dark:bg-ink-900">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonRow({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
