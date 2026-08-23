import { createPortal } from 'react-dom';
import { useToastStore } from '@/stores/toastStore';
import type { ToastVariant } from '@/stores/toastStore';

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-column-done/25 bg-white text-column-done dark:border-column-done/30 dark:bg-ink-900 dark:text-green-300',
  error: 'border-red-300/40 bg-white text-red-700 dark:border-red-800/50 dark:bg-ink-900 dark:text-red-300',
  warning:
    'border-accent-300/50 bg-white text-accent-700 dark:border-accent-500/30 dark:bg-ink-900 dark:text-accent-300',
  info: 'border-column-progress/25 bg-white text-column-progress dark:border-column-progress/30 dark:bg-ink-900 dark:text-blue-300',
};

const variantIcon: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={`pointer-events-auto flex animate-slide-up items-start gap-3 rounded-lg border px-4 py-3 shadow-card ${variantStyles[toast.variant]}`}
        >
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/60 text-xs font-bold dark:bg-black/20">
            {variantIcon[toast.variant]}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.description && <p className="mt-0.5 text-sm opacity-90">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss notification"
            className="focus-ring rounded p-0.5 opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
}
