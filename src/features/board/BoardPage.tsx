import { useMemo, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoardData } from '@/hooks/useBoardData';
import { useUsers } from '@/hooks/useUsers';
import { useBoardStore } from '@/stores/boardStore';
import { TASK_STATUSES } from '@/types';
import type { Task, TaskStatus } from '@/types';
import { Column } from '@/features/board/components/Column';
import { TaskDrawer } from '@/features/board/components/TaskDrawer';
import { CreateTaskModal } from '@/features/board/components/CreateTaskModal';
import { BoardFilters } from '@/features/board/components/BoardFilters';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

function applyFilters(tasks: Task[], filters: { priority: string; assigneeId: number | 'all' }): Task[] {
  return tasks.filter((t) => {
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
    if (filters.assigneeId !== 'all' && t.assigneeId !== filters.assigneeId) return false;
    return true;
  });
}

export function BoardPage() {
  const { isLoading, isError, refetch } = useBoardData();
  const { data: users = [] } = useUsers();
  const tasks = useBoardStore((s) => s.tasks);
  const filters = useBoardStore((s) => s.filters);
  const moveTask = useBoardStore((s) => s.moveTask);
  const setSelectedTaskId = useBoardStore((s) => s.setSelectedTaskId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const usersById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const filteredTasks = useMemo(() => applyFilters(tasks, filters), [tasks, filters]);

  const columns = useMemo(() => {
    const map = new Map<TaskStatus, Task[]>();
    for (const status of TASK_STATUSES) {
      map.set(
        status,
        filteredTasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order),
      );
    }
    return map;
  }, [filteredTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    let toStatus: TaskStatus;
    let toIndex: number;

    if ((TASK_STATUSES as string[]).includes(String(overId))) {
      toStatus = overId as TaskStatus;
      toIndex = columns.get(toStatus)?.length ?? 0;
    } else {
      const overTask = tasks.find((t) => t.id === Number(overId));
      if (!overTask) return;
      toStatus = overTask.status;
      const column = columns.get(toStatus) ?? [];
      toIndex = column.findIndex((t) => t.id === overTask.id);
      if (toIndex === -1) toIndex = column.length;
    }

    if (activeId === Number(overId)) return;
    moveTask(activeId, toStatus, toIndex);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-950 dark:text-paper-100">Sprint Board</h1>
          <p className="mt-0.5 font-mono text-xs text-ink-600 dark:text-paper-100/40">
            Drag tasks between columns to update their status.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>+ New task</Button>
      </div>

      {!isLoading && !isError && <BoardFilters users={users} />}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TASK_STATUSES.map((status) => (
            <div key={status} className="space-y-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ))}
        </div>
      )}

      {isError && <ErrorState message="Couldn't load the sprint board." onRetry={refetch} />}

      {!isLoading && !isError && (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 lg:mx-0 lg:grid lg:grid-cols-4 lg:items-start lg:gap-4 lg:overflow-visible lg:px-0">
            {TASK_STATUSES.map((status) => (
              <div key={status} className="snap-start lg:contents">
                <Column
                  status={status}
                  tasks={columns.get(status) ?? []}
                  usersById={usersById}
                  onOpenTask={setSelectedTaskId}
                />
              </div>
            ))}
          </div>
        </DndContext>
      )}

      <TaskDrawer users={users} usersById={usersById} />
      <CreateTaskModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} users={users} />
    </div>
  );
}
