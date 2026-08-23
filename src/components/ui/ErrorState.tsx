import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-300/40 bg-red-50 px-6 py-10 text-center dark:border-red-900/60 dark:bg-red-950/20"
    >
      <p className="text-sm font-medium text-red-700 dark:text-red-300">{title}</p>
      {message && <p className="max-w-xs text-sm text-red-600/80 dark:text-red-400/80">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
