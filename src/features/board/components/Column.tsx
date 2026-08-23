import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus, User } from '@/types';
import { STATUS_LABELS } from '@/types';
import { TaskCard } from '@/features/board/components/TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  usersById: Map<number, User>;
  onOpenTask: (taskId: number) => void;
}

const statusAccent: Record<TaskStatus, string> = {
  backlog: 'bg-column-backlog',
  'in-progress': 'bg-column-progress',
  review: 'bg-column-review',
  done: 'bg-column-done',
};

export function Column({ status, tasks, usersById, onOpenTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="flex w-72 flex-shrink-0 flex-col lg:w-full">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className={`h-1.5 w-4 rounded-full ${statusAccent[status]}`} aria-hidden="true" />
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-ink-700 dark:text-paper-100/70">
          {STATUS_LABELS[status]}
        </h2>
        <span className="ml-auto rounded-full bg-ink-950/6 px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink-600 dark:bg-paper-100/8 dark:text-paper-100/50">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[100px] flex-col gap-2 rounded-lg p-1.5 transition-colors ${
          isOver ? 'bg-accent-400/10' : ''
        } ${tasks.length === 0 ? 'flex-1' : ''}`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} assignee={usersById.get(task.assigneeId ?? -1)} onOpen={onOpenTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-1 items-center px-1 py-2">
            <EmptyState title="No tasks" description="Drag a task here, or create one." />
          </div>
        )}
      </div>
    </div>
  );
}
