import { useToastStore } from '@/stores/toastStore';

export function useToast() {
  const show = useToastStore((s) => s.show);
  const dismiss = useToastStore((s) => s.dismiss);

  return {
    success: (title: string, description?: string) => show({ variant: 'success', title, description }),
    error: (title: string, description?: string) => show({ variant: 'error', title, description }),
    warning: (title: string, description?: string) => show({ variant: 'warning', title, description }),
    info: (title: string, description?: string) => show({ variant: 'info', title, description }),
    dismiss,
  };
}
