import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskPriority, User } from '@/types';
import { PriorityBadge } from '@/features/board/components/PriorityBadge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, isOverdue } from '@/utils/formatDate';

interface TaskCardProps {
  task: Task;
  assignee: User | undefined;
  onOpen: (taskId: number) => void;
}

const priorityRail: Record<TaskPriority, string> = {
  low: 'border-l-ink-950/15 dark:border-l-paper-100/15',
  medium: 'border-l-column-progress',
  high: 'border-l-red-500',
};

export function TaskCard({ task, assignee, onOpen }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      aria-roledescription="Draggable task card"
      aria-label={`${task.title}, priority ${task.priority}, ${assignee ? `assigned to ${assignee.name}` : 'unassigned'}`}
      onClick={() => onOpen(task.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(task.id);
        }
      }}
      className={`rail focus-ring group cursor-grab space-y-2.5 rounded-r-lg rounded-l-sm border border-l-[3px] border-ink-950/8 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card active:cursor-grabbing dark:border-paper-100/8 dark:bg-ink-900 ${priorityRail[task.priority]}`}
    >
      <p className="text-sm font-medium leading-snug text-ink-950 dark:text-paper-100">{task.title}</p>
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        <Avatar name={assignee?.name ?? 'Unassigned'} src={assignee?.avatar} />
      </div>
      <p
        className={`font-mono text-[11px] ${
          overdue ? 'font-semibold text-red-600 dark:text-red-400' : 'text-ink-600/60 dark:text-paper-100/35'
        }`}
      >
        {overdue ? 'OVERDUE · ' : 'DUE '}
        {formatDate(task.dueDate).toUpperCase()}
      </p>
    </div>
  );
}
