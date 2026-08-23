import { useEffect, useState, type FormEvent } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useBoardStore } from '@/stores/boardStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/utils/formatDate';
import type { TaskPriority, TaskStatus, User } from '@/types';
import { PRIORITY_LABELS, STATUS_LABELS, TASK_STATUSES } from '@/types';
import { DeleteConfirmDialog } from '@/features/board/components/DeleteConfirmDialog';

interface TaskDrawerProps {
  users: User[];
  usersById: Map<number, User>;
}

export function TaskDrawer({ users, usersById }: TaskDrawerProps) {
  const selectedTaskId = useBoardStore((s) => s.selectedTaskId);
  const setSelectedTaskId = useBoardStore((s) => s.setSelectedTaskId);
  const tasks = useBoardStore((s) => s.tasks);
  const comments = useBoardStore((s) => s.comments);
  const updateTask = useBoardStore((s) => s.updateTask);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const addComment = useBoardStore((s) => s.addComment);
  const requestDelete = useBoardStore((s) => s.requestDelete);
  const taskPendingDelete = useBoardStore((s) => s.taskPendingDelete);
  const currentUser = useAuthStore((s) => s.user);
  const toast = useToast();

  const task = tasks.find((t) => t.id === selectedTaskId);
  const taskComments = comments.filter((c) => c.taskId === selectedTaskId);

  const [draft, setDraft] = useState({ title: '', description: '', priority: 'medium' as TaskPriority, status: 'backlog' as TaskStatus, assigneeId: '', dueDate: '' });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (task) {
      setDraft({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assigneeId: task.assigneeId ? String(task.assigneeId) : '',
        dueDate: task.dueDate ?? '',
      });
    }
  }, [task?.id]);

  if (!task) return null;

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!task) return;
    if (!draft.title.trim()) {
      toast.error('Title is required');
      return;
    }
    updateTask(task.id, {
      title: draft.title.trim(),
      description: draft.description.trim(),
      priority: draft.priority,
      status: draft.status,
      assigneeId: draft.assigneeId ? Number(draft.assigneeId) : null,
      dueDate: draft.dueDate || null,
    });
    toast.success('Task updated');
  }

  function handleAddComment(e: FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !task) return;
    addComment(task.id, currentUser?.id ?? 1, newComment.trim());
    setNewComment('');
  }

  return (
    <>
      <Drawer isOpen={!!task} onClose={() => setSelectedTaskId(null)} title="Task details">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Title" required value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />

          <div>
            <label htmlFor="task-description" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-paper-200">
              Description
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              className="focus-ring w-full rounded-lg border border-ink-950/20 bg-white px-3 py-2 text-sm text-ink-950 dark:border-paper-100/20 dark:bg-ink-900 dark:text-paper-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as TaskStatus }))}
              options={TASK_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
            />
            <Select
              label="Priority"
              value={draft.priority}
              onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as TaskPriority }))}
              options={Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assignee"
              placeholder="Unassigned"
              value={draft.assigneeId}
              onChange={(e) => setDraft((d) => ({ ...d, assigneeId: e.target.value }))}
              options={users.map((u) => ({ value: String(u.id), label: u.name }))}
            />
            <Input
              label="Due date"
              type="date"
              value={draft.dueDate}
              onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
            />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-600/70 dark:text-paper-100/45">
            <span>Created {formatDate(task.createdAt)}</span>
            <span>Updated {formatDate(task.updatedAt)}</span>
            {task.completedAt && <span>Completed {formatDate(task.completedAt)}</span>}
          </div>

          <div className="flex items-center justify-between border-t border-ink-950/8 pt-4 dark:border-paper-100/10">
            <Button type="button" variant="danger" size="sm" onClick={() => requestDelete(task.id)}>
              Delete task
            </Button>
            <Button type="submit" size="sm">
              Save changes
            </Button>
          </div>
        </form>

        <div className="mt-6 border-t border-ink-950/8 pt-4 dark:border-paper-100/10">
          <h3 className="mb-3 text-sm font-semibold text-ink-950 dark:text-paper-100">
            Comments <Badge>{taskComments.length}</Badge>
          </h3>

          <div className="mb-4 space-y-3">
            {taskComments.length === 0 && <p className="text-sm text-ink-600/70 dark:text-paper-100/45">No comments yet.</p>}
            {taskComments.map((c) => {
              const author = usersById.get(c.authorId);
              return (
                <div key={c.id} className="flex gap-2">
                  <Avatar name={author?.name ?? 'Unknown'} src={author?.avatar} />
                  <div className="flex-1 rounded-lg bg-ink-950/[0.03] px-3 py-2 dark:bg-paper-100/8">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-ink-700 dark:text-paper-200">{author?.name ?? 'Unknown'}</p>
                      <p className="text-[11px] text-ink-600/40">{formatDate(c.createdAt)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-700 dark:text-paper-100/70">{c.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <label htmlFor="new-comment" className="sr-only">
              Add a comment
            </label>
            <input
              id="new-comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="focus-ring flex-1 rounded-lg border border-ink-950/20 bg-white px-3 py-2 text-sm dark:border-paper-100/20 dark:bg-ink-900 dark:text-paper-100"
            />
            <Button type="submit" size="sm" disabled={!newComment.trim()}>
              Post
            </Button>
          </form>
        </div>
      </Drawer>

      <DeleteConfirmDialog
        isOpen={taskPendingDelete !== null}
        taskTitle={tasks.find((t) => t.id === taskPendingDelete)?.title}
        onCancel={() => requestDelete(null)}
        onConfirm={() => {
          if (taskPendingDelete !== null) {
            deleteTask(taskPendingDelete);
            toast.success('Task deleted');
          }
        }}
      />
    </>
  );
}
