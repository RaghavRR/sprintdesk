import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { TaskPriority, User } from '@/types';
import { PRIORITY_LABELS } from '@/types';
import { useBoardStore } from '@/stores/boardStore';
import { useToast } from '@/hooks/useToast';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

interface FormState {
  title: string;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  description: string;
}

const initialState: FormState = { title: '', priority: 'medium', assigneeId: '', dueDate: '', description: '' };

export function CreateTaskModal({ isOpen, onClose, users }: CreateTaskModalProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [titleError, setTitleError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTask = useBoardStore((s) => s.addTask);
  const toast = useToast();

  function handleClose() {
    setForm(initialState);
    setTitleError(undefined);
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setTitleError('Task title is required.');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    addTask({
      title: form.title.trim(),
      priority: form.priority,
      assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
      dueDate: form.dueDate || null,
      description: form.description.trim(),
    });

    setIsSubmitting(false);
    toast.success('Task created', `"${form.title.trim()}" was added to Backlog.`);
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create new task">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Title"
          required
          value={form.title}
          onChange={(e) => {
            setForm((f) => ({ ...f, title: e.target.value }));
            if (titleError) setTitleError(undefined);
          }}
          error={titleError}
          placeholder="e.g. Fix pagination bug on board"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Priority"
            required
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
            options={Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <Select
            label="Assignee"
            placeholder="Unassigned"
            value={form.assigneeId}
            onChange={(e) => setForm((f) => ({ ...f, assigneeId: e.target.value }))}
            options={users.map((u) => ({ value: String(u.id), label: u.name }))}
          />
        </div>

        <Input
          label="Due date"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
        />

        <div>
          <label htmlFor="new-task-description" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-paper-200">
            Description
          </label>
          <textarea
            id="new-task-description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="focus-ring w-full rounded-lg border border-ink-950/20 bg-white px-3 py-2 text-sm text-ink-950 dark:border-paper-100/20 dark:bg-ink-900 dark:text-paper-100"
            placeholder="Optional details..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
