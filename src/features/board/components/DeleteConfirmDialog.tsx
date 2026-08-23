import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  taskTitle: string | undefined;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ isOpen, taskTitle, onCancel, onConfirm }: DeleteConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete task" size="sm">
      <p className="text-sm text-ink-600 dark:text-paper-100/70">
        Are you sure you want to delete <span className="font-medium text-ink-950 dark:text-paper-100">"{taskTitle}"</span>?
        This action cannot be undone.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete task
        </Button>
      </div>
    </Modal>
  );
}
